import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../models/models.dart';
import '../../services/icp_service.dart';

class ArtifactListScreen extends ConsumerStatefulWidget {
  const ArtifactListScreen({super.key});

  @override
  ConsumerState<ArtifactListScreen> createState() => _ArtifactListScreenState();
}

class _ArtifactListScreenState extends ConsumerState<ArtifactListScreen> {
  List<Artifact> _artifacts = [];
  bool _isLoading = true;
  String _searchQuery = '';
  ArtifactStatus? _filterStatus;

  @override
  void initState() {
    super.initState();
    _loadArtifacts();
  }

  Future<void> _loadArtifacts() async {
    setState(() => _isLoading = true);
    try {
      List<Artifact> artifacts;
      if (_filterStatus != null) {
        artifacts = await ICPService().getArtifactsByStatus(_filterStatus!);
      } else if (_searchQuery.isNotEmpty) {
        artifacts = await ICPService().searchArtifacts(_searchQuery);
      } else {
        artifacts = await ICPService().getAllArtifacts();
      }
      
      // Sort by creation date (newest first)
      artifacts.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      
      setState(() {
        _artifacts = artifacts;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      _showErrorSnackBar('Failed to load artifacts: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Artifacts'),
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
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search artifacts...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: Colors.grey[100],
              ),
              onChanged: (value) {
                setState(() => _searchQuery = value);
                if (value.isEmpty) {
                  _loadArtifacts();
                }
              },
              onSubmitted: (value) => _loadArtifacts(),
            ),
          ),
          
          // Filter Chip
          if (_filterStatus != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Chip(
                    label: Text('Filter: ${_getStatusDisplayName(_filterStatus!)}'),
                    deleteIcon: const Icon(Icons.close, size: 18),
                    onDeleted: () {
                      setState(() => _filterStatus = null);
                      _loadArtifacts();
                    },
                  ),
                ],
              ),
            ),
          
          // Artifacts List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _artifacts.isEmpty
                    ? const Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.inventory, size: 64, color: Colors.grey),
                            SizedBox(height: 16),
                            Text(
                              'No artifacts found',
                              style: TextStyle(
                                fontSize: 18,
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _loadArtifacts,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: _artifacts.length,
                          itemBuilder: (context, index) {
                            final artifact = _artifacts[index];
                            return _buildArtifactCard(artifact);
                          },
                        ),
                      ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // TODO: Navigate to create artifact screen
          _showFeatureComingSoon('Create Artifact');
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildArtifactCard(Artifact artifact) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: () => context.go('/artifacts/${artifact.id}'),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      artifact.name,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getStatusColor(artifact.status),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      _getStatusDisplayName(artifact.status),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                artifact.description,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.person, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      'Creator: ${artifact.creator.substring(0, 8)}...',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
                  Icon(Icons.access_time, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    _formatDate(artifact.createdAtDateTime),
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.verified, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    'Score: ${artifact.authenticityScore}%',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                  const Spacer(),
                  if (artifact.images.isNotEmpty)
                    Row(
                      children: [
                        Icon(Icons.image, size: 16, color: Colors.grey[600]),
                        const SizedBox(width: 4),
                        Text(
                          '${artifact.images.length} image${artifact.images.length != 1 ? 's' : ''}',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
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
        title: const Text('Filter Artifacts'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              title: const Text('All'),
              leading: Radio<ArtifactStatus?>(
                value: null,
                groupValue: _filterStatus,
                onChanged: (value) {
                  setState(() => _filterStatus = value);
                  Navigator.pop(context);
                  _loadArtifacts();
                },
              ),
            ),
            ...ArtifactStatus.values.map((status) => ListTile(
              title: Text(_getStatusDisplayName(status)),
              leading: Radio<ArtifactStatus?>(
                value: status,
                groupValue: _filterStatus,
                onChanged: (value) {
                  setState(() => _filterStatus = value);
                  Navigator.pop(context);
                  _loadArtifacts();
                },
              ),
            )),
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