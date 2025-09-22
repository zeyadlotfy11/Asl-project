import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../models/models.dart';
import '../services/icp_service.dart';

class RecentArtifactsWidget extends StatefulWidget {
  const RecentArtifactsWidget({super.key});

  @override
  State<RecentArtifactsWidget> createState() => _RecentArtifactsWidgetState();
}

class _RecentArtifactsWidgetState extends State<RecentArtifactsWidget> {
  List<Artifact> _artifacts = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadArtifacts();
  }

  Future<void> _loadArtifacts() async {
    try {
      final artifacts = await ICPService().getAllArtifacts();
      // Sort by creation date and take the 5 most recent
      artifacts.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      setState(() {
        _artifacts = artifacts.take(5).toList();
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
                  'Recent Artifacts',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                TextButton(
                  onPressed: () => context.go('/artifacts'),
                  child: const Text('See All'),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (_isLoading)
              const Center(child: CircularProgressIndicator())
            else if (_artifacts.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Text('No artifacts found'),
                ),
              )
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _artifacts.length,
                separatorBuilder: (context, index) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final artifact = _artifacts[index];
                  return ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: CircleAvatar(
                      backgroundColor: _getStatusColor(artifact.status),
                      child: Icon(
                        Icons.inventory,
                        color: Colors.white,
                        size: 20,
                      ),
                    ),
                    title: Text(
                      artifact.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    subtitle: Text(
                      _getStatusDisplayName(artifact.status),
                      style: TextStyle(
                        color: _getStatusColor(artifact.status),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () => context.go('/artifacts/${artifact.id}'),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(ArtifactStatus status) {
    switch (status) {
      case ArtifactStatus.verified:
        return Colors.green;
      case ArtifactStatus.pendingVerification:
        return Colors.orange;
      case ArtifactStatus.disputed:
        return Colors.red;
      case ArtifactStatus.rejected:
        return Colors.grey;
    }
  }

  String _getStatusDisplayName(ArtifactStatus status) {
    switch (status) {
      case ArtifactStatus.verified:
        return 'Verified';
      case ArtifactStatus.pendingVerification:
        return 'Pending';
      case ArtifactStatus.disputed:
        return 'Disputed';
      case ArtifactStatus.rejected:
        return 'Rejected';
    }
  }
}