import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import VideoCard from '../components/VideoCard';
import VideoForm from '../components/VideoForm';
import Loading from '../components/Loading';
import Error from '../components/Error';
import EmptyState from '../components/EmptyState';
import Modal from '../../../shared/components/Modal';
import { getVideos, createVideo, updateVideo, deleteVideo, getResumeUrl } from '../services/videoService';
import { dummyVideos } from '../data/dummyData';
import './VideoListPage.css';

const VideoListPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recently-updated');
  const [selectedFolder, setSelectedFolder] = useState('All Videos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const data = await getVideos();
      setVideos(data);
    } catch (err) {
      console.error('API failed, using dummy data', err);
      setVideos(dummyVideos);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async (videoData) => {
    try {
      await createVideo(videoData);
      fetchVideos();
      setShowAddModal(false);
    } catch (err) {
      setError('Failed to add video');
    }
  };

  const handleEditVideo = async (id, videoData) => {
    try {
      await updateVideo(id, videoData);
      fetchVideos();
      setEditingVideo(null);
    } catch (err) {
      setError('Failed to update video');
    }
  };

  const handleDeleteVideo = async (id) => {
    try {
      await deleteVideo(id);
      fetchVideos();
    } catch (err) {
      setError('Failed to delete video');
    }
  };

  const handleResume = async (id) => {
    try {
      const resumeUrl = await getResumeUrl(id);
      window.open(resumeUrl, '_blank');
    } catch (err) {
      setError('Failed to resume video');
    }
  };

  const filteredAndSortedVideos = () => {
    let filtered = videos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || video.status === statusFilter;
      const matchesFolder = selectedFolder === 'All Videos' || video.folder === selectedFolder;
      return matchesSearch && matchesStatus && matchesFolder;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recently-updated':
          return new Date(b.updated_at) - new Date(a.updated_at);
        case 'recently-added':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'title-a-z':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={fetchVideos} />;

  const filteredVideos = filteredAndSortedVideos();

  return (
    <div className="video-list-page">
      <Sidebar selectedFolder={selectedFolder} onSelectFolder={setSelectedFolder} />
      <div className="main-content">
        <TopBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onAddVideo={() => setShowAddModal(true)}
        />
        <div className="video-grid">
          {filteredVideos.length === 0 ? (
            <EmptyState onAddVideo={() => setShowAddModal(true)} />
          ) : (
            filteredVideos.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                onResume={() => handleResume(video.id)}
                onEdit={() => setEditingVideo(video)}
                onDelete={() => handleDeleteVideo(video.id)}
              />
            ))
          )}
        </div>
      </div>
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <VideoForm onSubmit={handleAddVideo} />
      </Modal>
      <Modal isOpen={!!editingVideo} onClose={() => setEditingVideo(null)}>
        <VideoForm video={editingVideo} onSubmit={(data) => handleEditVideo(editingVideo.id, data)} />
      </Modal>
    </div>
  );
};

export default VideoListPage;