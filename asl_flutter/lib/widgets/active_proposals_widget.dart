import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../models/models.dart';
import '../services/icp_service.dart';

class ActiveProposalsWidget extends StatefulWidget {
  const ActiveProposalsWidget({super.key});

  @override
  State<ActiveProposalsWidget> createState() => _ActiveProposalsWidgetState();
}

class _ActiveProposalsWidgetState extends State<ActiveProposalsWidget> {
  List<ProposalResponse> _proposals = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadProposals();
  }

  Future<void> _loadProposals() async {
    try {
      final proposals = await ICPService().getActiveProposals();
      // Take the 5 most recent active proposals
      proposals.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      setState(() {
        _proposals = proposals.take(5).toList();
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Active Proposals',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                TextButton(
                  onPressed: () => context.go('/proposals'),
                  child: const Text('See All'),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (_isLoading)
              const Center(child: CircularProgressIndicator())
            else if (_proposals.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Text('No active proposals'),
                ),
              )
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _proposals.length,
                separatorBuilder: (context, index) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final proposal = _proposals[index];
                  return ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: CircleAvatar(
                      backgroundColor: _getProposalTypeColor(proposal.proposalType),
                      child: Icon(
                        _getProposalTypeIcon(proposal.proposalType),
                        color: Colors.white,
                        size: 20,
                      ),
                    ),
                    title: Text(
                      proposal.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _getProposalTypeDisplayName(proposal.proposalType),
                          style: TextStyle(
                            color: _getProposalTypeColor(proposal.proposalType),
                            fontWeight: FontWeight.w500,
                            fontSize: 12,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Row(
                          children: [
                            Icon(Icons.how_to_vote, size: 12, color: Colors.grey[600]),
                            const SizedBox(width: 4),
                            Text(
                              '${proposal.votesFor + proposal.votesAgainst} votes',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey[600],
                              ),
                            ),
                            const SizedBox(width: 12),
                            Icon(Icons.access_time, size: 12, color: Colors.grey[600]),
                            const SizedBox(width: 4),
                            Text(
                              timeago.format(proposal.votingDeadlineDateTime),
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () => context.go('/proposals/${proposal.id}'),
                  );
                },
              ),
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

  IconData _getProposalTypeIcon(ProposalType type) {
    switch (type) {
      case ProposalType.verifyArtifact:
        return Icons.verified;
      case ProposalType.disputeArtifact:
        return Icons.report;
      case ProposalType.updateArtifactStatus:
        return Icons.update;
      case ProposalType.grantUserRole:
        return Icons.person_add;
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
}