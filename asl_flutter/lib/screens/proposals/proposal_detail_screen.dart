import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/models.dart';
import '../../services/icp_service.dart';

class ProposalDetailScreen extends ConsumerStatefulWidget {
  final int proposalId;

  const ProposalDetailScreen({
    super.key,
    required this.proposalId,
  });

  @override
  ConsumerState<ProposalDetailScreen> createState() => _ProposalDetailScreenState();
}

class _ProposalDetailScreenState extends ConsumerState<ProposalDetailScreen> {
  Proposal? _proposal;
  List<Vote> _votes = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadProposal();
  }

  Future<void> _loadProposal() async {
    try {
      final proposal = await ICPService().getProposal(widget.proposalId);
      final votes = await ICPService().getVoteDetails(widget.proposalId);
      setState(() {
        _proposal = proposal;
        _votes = votes;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      _showErrorSnackBar('Failed to load proposal: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_proposal?.title ?? 'Proposal Details'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _proposal == null
              ? const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.error, size: 64, color: Colors.red),
                      SizedBox(height: 16),
                      Text(
                        'Proposal not found',
                        style: TextStyle(fontSize: 18),
                      ),
                    ],
                  ),
                )
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildHeader(),
                      const SizedBox(height: 24),
                      _buildVotingStats(),
                      const SizedBox(height: 24),
                      _buildDescription(),
                      const SizedBox(height: 24),
                      if (_proposal!.isActive) _buildVotingActions(),
                      if (_proposal!.isActive) const SizedBox(height: 24),
                      _buildVotesList(),
                    ],
                  ),
                ),
    );
  }

  Widget _buildHeader() {
    return Card(
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
                    color: _getProposalTypeColor(_proposal!.proposalType),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _getProposalTypeDisplayName(_proposal!.proposalType),
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
                    color: _getStatusColor(_proposal!.status),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _getStatusDisplayName(_proposal!.status),
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
              _proposal!.title,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.person, size: 16, color: Colors.grey[600]),
                const SizedBox(width: 4),
                Text(
                  'Proposer: ${_proposal!.proposer.substring(0, 16)}...',
                  style: TextStyle(color: Colors.grey[600]),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                Icon(Icons.access_time, size: 16, color: Colors.grey[600]),
                const SizedBox(width: 4),
                Text(
                  _proposal!.isActive 
                      ? 'Voting ends: ${_formatDate(_proposal!.votingDeadlineDateTime)}'
                      : 'Voting ended: ${_formatDate(_proposal!.votingDeadlineDateTime)}',
                  style: TextStyle(
                    color: _proposal!.isActive ? Colors.orange : Colors.grey[600],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildVotingStats() {
    final totalVotes = _proposal!.totalVotes;
    final supportPercentage = _proposal!.supportPercentage;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Voting Statistics',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildVoteCount(
                    'For',
                    _proposal!.votesFor,
                    Colors.green,
                    Icons.thumb_up,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildVoteCount(
                    'Against',
                    _proposal!.votesAgainst,
                    Colors.red,
                    Icons.thumb_down,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Support: ${supportPercentage.toStringAsFixed(1)}%',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    Text(
                      'Total votes: $totalVotes',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                LinearProgressIndicator(
                  value: totalVotes > 0 ? supportPercentage / 100 : 0,
                  backgroundColor: Colors.grey.shade300,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    supportPercentage >= 50 ? Colors.green : Colors.red,
                  ),
                  minHeight: 8,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildVoteCount(String label, int count, Color color, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 32),
          const SizedBox(height: 8),
          Text(
            count.toString(),
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          Text(
            label,
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDescription() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Description',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              _proposal!.description,
              style: const TextStyle(fontSize: 16),
            ),
            if (_proposal!.executionPayload != null) ...[
              const SizedBox(height: 16),
              const Text(
                'Execution Payload',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  _proposal!.executionPayload!,
                  style: const TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 14,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildVotingActions() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Cast Your Vote',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _showVoteDialog(VoteType.forVote),
                    icon: const Icon(Icons.thumb_up),
                    label: const Text('Vote For'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _showVoteDialog(VoteType.against),
                    icon: const Icon(Icons.thumb_down),
                    label: const Text('Vote Against'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => _showVoteDialog(VoteType.abstain),
                icon: const Icon(Icons.remove),
                label: const Text('Abstain'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.grey,
                  foregroundColor: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildVotesList() {
    if (_votes.isEmpty) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Votes (${_votes.length})',
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _votes.length,
              separatorBuilder: (context, index) => const Divider(),
              itemBuilder: (context, index) {
                final vote = _votes[index];
                return ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: CircleAvatar(
                    backgroundColor: _getVoteTypeColor(vote.voteType),
                    child: Icon(
                      _getVoteTypeIcon(vote.voteType),
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                  title: Text(
                    '${vote.voter.substring(0, 16)}...',
                    style: const TextStyle(fontWeight: FontWeight.w500),
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _getVoteTypeDisplayName(vote.voteType),
                        style: TextStyle(
                          color: _getVoteTypeColor(vote.voteType),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      if (vote.rationale != null)
                        Text(
                          vote.rationale!,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                    ],
                  ),
                  trailing: Text(
                    _formatDate(vote.timestampDateTime),
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showVoteDialog(VoteType voteType) {
    final rationaleController = TextEditingController();
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('${_getVoteTypeDisplayName(voteType)} Vote'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Are you sure you want to vote ${voteType.value.toLowerCase()} this proposal?'),
            const SizedBox(height: 16),
            TextField(
              controller: rationaleController,
              decoration: const InputDecoration(
                labelText: 'Rationale (optional)',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _submitVote(voteType, rationaleController.text.isEmpty ? null : rationaleController.text);
            },
            child: const Text('Submit Vote'),
          ),
        ],
      ),
    );
  }

  Future<void> _submitVote(VoteType voteType, String? rationale) async {
    try {
      await ICPService().voteOnProposal(widget.proposalId, voteType, rationale);
      _showSuccessSnackBar('Vote submitted successfully!');
      _loadProposal(); // Refresh data
    } catch (e) {
      _showErrorSnackBar('Failed to submit vote: $e');
    }
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
        return 'Verify Artifact';
      case ProposalType.disputeArtifact:
        return 'Dispute Artifact';
      case ProposalType.updateArtifactStatus:
        return 'Update Status';
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

  Color _getVoteTypeColor(VoteType type) {
    switch (type) {
      case VoteType.forVote:
        return Colors.green;
      case VoteType.against:
        return Colors.red;
      case VoteType.abstain:
        return Colors.grey;
    }
  }

  IconData _getVoteTypeIcon(VoteType type) {
    switch (type) {
      case VoteType.forVote:
        return Icons.thumb_up;
      case VoteType.against:
        return Icons.thumb_down;
      case VoteType.abstain:
        return Icons.remove;
    }
  }

  String _getVoteTypeDisplayName(VoteType type) {
    switch (type) {
      case VoteType.forVote:
        return 'For';
      case VoteType.against:
        return 'Against';
      case VoteType.abstain:
        return 'Abstain';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  void _showSuccessSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
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