import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../models/models.dart';
import '../../services/icp_service.dart';

class ProposalListScreen extends ConsumerStatefulWidget {
  const ProposalListScreen({super.key});

  @override
  ConsumerState<ProposalListScreen> createState() => _ProposalListScreenState();
}

class _ProposalListScreenState extends ConsumerState<ProposalListScreen> {
  List<ProposalResponse> _proposals = [];
  bool _isLoading = true;
  ProposalStatus? _filterStatus;

  @override
  void initState() {
    super.initState();
    _loadProposals();
  }

  Future<void> _loadProposals() async {
    setState(() => _isLoading = true);
    try {
      List<ProposalResponse> proposals;
      if (_filterStatus != null) {
        proposals = await ICPService().getProposalsByStatus(_filterStatus!);
      } else {
        proposals = await ICPService().getAllProposals();
      }
      
      // Sort by creation date (newest first)
      proposals.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      
      setState(() {
        _proposals = proposals;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      _showErrorSnackBar('Failed to load proposals: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Proposals'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/home'),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter Chip
          if (_filterStatus != null)
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Chip(
                    label: Text('Filter: ${_getStatusDisplayName(_filterStatus!)}'),
                    deleteIcon: const Icon(Icons.close, size: 18),
                    onDeleted: () {
                      setState(() => _filterStatus = null);
                      _loadProposals();
                    },
                  ),
                ],
              ),
            ),
          
          // Proposals List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _proposals.isEmpty
                    ? const Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.how_to_vote, size: 64, color: Colors.grey),
                            SizedBox(height: 16),
                            Text(
                              'No proposals found',
                              style: TextStyle(
                                fontSize: 18,
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _loadProposals,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: _proposals.length,
                          itemBuilder: (context, index) {
                            final proposal = _proposals[index];
                            return _buildProposalCard(proposal);
                          },
                        ),
                      ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          _showFeatureComingSoon('Create Proposal');
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildProposalCard(ProposalResponse proposal) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: () => context.go('/proposals/${proposal.id}'),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getProposalTypeColor(proposal.proposalType),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      _getProposalTypeDisplayName(proposal.proposalType),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getStatusColor(proposal.status),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      _getStatusDisplayName(proposal.status),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                proposal.title,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                proposal.description,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 12),
              
              // Voting Progress
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Support: ${proposal.supportPercentage.toStringAsFixed(1)}%',
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            Text(
                              '${proposal.totalVotes} votes',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        LinearProgressIndicator(
                          value: proposal.totalVotes > 0 ? proposal.supportPercentage / 100 : 0,
                          backgroundColor: Colors.grey.shade300,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            proposal.supportPercentage >= 50 ? Colors.green : Colors.red,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.access_time, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    proposal.isActive 
                        ? 'Ends: ${_formatDate(proposal.votingDeadlineDateTime)}'
                        : 'Ended: ${_formatDate(proposal.votingDeadlineDateTime)}',
                    style: TextStyle(
                      fontSize: 12,
                      color: proposal.isActive ? Colors.orange : Colors.grey[600],
                    ),
                  ),
                  const Spacer(),
                  Row(
                    children: [
                      Icon(Icons.thumb_up, size: 16, color: Colors.green),
                      const SizedBox(width: 4),
                      Text(
                        '${proposal.votesFor}',
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.green,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Icon(Icons.thumb_down, size: 16, color: Colors.red),
                      const SizedBox(width: 4),
                      Text(
                        '${proposal.votesAgainst}',
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.red,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Filter Proposals'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              title: const Text('All'),
              leading: Radio<ProposalStatus?>(
                value: null,
                groupValue: _filterStatus,
                onChanged: (value) {
                  setState(() => _filterStatus = value);
                  Navigator.pop(context);
                  _loadProposals();
                },
              ),
            ),
            ...ProposalStatus.values.map((status) => ListTile(
              title: Text(_getStatusDisplayName(status)),
              leading: Radio<ProposalStatus?>(
                value: status,
                groupValue: _filterStatus,
                onChanged: (value) {
                  setState(() => _filterStatus = value);
                  Navigator.pop(context);
                  _loadProposals();
                },
              ),
            )),
          ],
        ),
      ),
    );
  }

  Color _getProposalTypeColor(ProposalType type) {
    switch (type) {
      case ProposalType.verifyArtifact:
        return Colors.green;
      case ProposalType.disputeArtifact:
        return Colors.red;
      case ProposalType.updateArtifactStatus:
        return Colors.blue;
      case ProposalType.grantUserRole:
        return Colors.purple;
    }
  }

  String _getProposalTypeDisplayName(ProposalType type) {
    switch (type) {
      case ProposalType.verifyArtifact:
        return 'Verify';
      case ProposalType.disputeArtifact:
        return 'Dispute';
      case ProposalType.updateArtifactStatus:
        return 'Update';
      case ProposalType.grantUserRole:
        return 'Grant Role';
    }
  }

  Color _getStatusColor(ProposalStatus status) {
    switch (status) {
      case ProposalStatus.active:
        return Colors.blue;
      case ProposalStatus.passed:
        return Colors.green;
      case ProposalStatus.rejected:
        return Colors.red;
      case ProposalStatus.executed:
        return Colors.purple;
    }
  }

  String _getStatusDisplayName(ProposalStatus status) {
    switch (status) {
      case ProposalStatus.active:
        return 'Active';
      case ProposalStatus.passed:
        return 'Passed';
      case ProposalStatus.rejected:
        return 'Rejected';
      case ProposalStatus.executed:
        return 'Executed';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  void _showFeatureComingSoon(String feature) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$feature feature coming soon!'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
      ),
    );
  }
}