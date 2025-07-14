import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Check, 
  X, 
  Eye,
  Filter,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';
import { usersService } from '../../services/usersService';
import { toast } from '../ui/Toaster';

interface TrainingEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  attendees: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestDate: string;
}

interface ApproveTrainingEventsProps {
  onEventApproved: () => void;
}

export const ApproveTrainingEvents: React.FC<ApproveTrainingEventsProps> = ({ onEventApproved }) => {
  const [events, setEvents] = useState<TrainingEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<TrainingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<TrainingEvent | null>(null);
  const [processingEvent, setProcessingEvent] = useState<string | null>(null);
  
  const eventsPerPage = 5;

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, statusFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const eventsData = await usersService.getTrainingEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching training events:', error);
      toast.error('Failed to fetch training events');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  const handleEventAction = async (eventId: string, action: 'approve' | 'reject') => {
    setProcessingEvent(eventId);
    try {
      if (action === 'approve') {
        await usersService.approveTrainingEvent(eventId);
        toast.success('Training event approved successfully');
      } else {
        await usersService.rejectTrainingEvent(eventId);
        toast.success('Training event rejected');
      }
      
      // Update the events list
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, status: action === 'approve' ? 'approved' : 'rejected' } 
          : event
      ));
      
      onEventApproved();
    } catch (error) {
      console.error(`Error ${action}ing event:`, error);
      toast.error(`Failed to ${action} event`);
    } finally {
      setProcessingEvent(null);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-4 text-gray-600 dark:text-gray-300">Loading training events...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Approve Training Events</h2>
          <p className="text-gray-600 dark:text-gray-300">Review and approve training event requests</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <Button onClick={fetchEvents} variant="outline">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {paginatedEvents.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className={`p-6 border-l-4 ${
              event.status === 'pending'
                ? 'border-yellow-500'
                : event.status === 'approved'
                ? 'border-green-500'
                : 'border-red-500'
            }`}>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Event Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      event.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-600'
                        : event.status === 'approved'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Requested by: {event.requestedBy} on {formatDate(event.requestDate)}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {event.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                
                {/* Status & Actions */}
                <div className="flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : event.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {event.status.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">{event.attendees}/{event.capacity}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    
                    {event.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleEventAction(event.id, 'approve')}
                          disabled={processingEvent === event.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {processingEvent === event.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Approve
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEventAction(event.id, 'reject')}
                          disabled={processingEvent === event.id}
                          className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {startIndex + 1} to {Math.min(startIndex + eventsPerPage, filteredEvents.length)} of {filteredEvents.length} events
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No training events found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {searchTerm || statusFilter !== 'pending'
              ? 'Try adjusting your search or filters'
              : 'There are no pending training events to approve'
            }
          </p>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Description
                  </h4>
                  <p className="text-gray-900 dark:text-white">
                    {selectedEvent.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Date
                    </h4>
                    <p className="text-gray-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {formatDate(selectedEvent.startDate)}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Time
                    </h4>
                    <p className="text-gray-900 dark:text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {formatTime(selectedEvent.startDate)} - {formatTime(selectedEvent.endDate)}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Location
                    </h4>
                    <p className="text-gray-900 dark:text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      {selectedEvent.location}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Capacity
                    </h4>
                    <p className="text-gray-900 dark:text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      {selectedEvent.attendees}/{selectedEvent.capacity} attendees
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Status
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedEvent.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : selectedEvent.status === 'approved'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {selectedEvent.status.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Requested by {selectedEvent.requestedBy} on {formatDate(selectedEvent.requestDate)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
                {selectedEvent.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => {
                        handleEventAction(selectedEvent.id, 'approve');
                        setSelectedEvent(null);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleEventAction(selectedEvent.id, 'reject');
                        setSelectedEvent(null);
                      }}
                      className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </Button>
                  </>
                )}
                
                <Button
                  variant="ghost"
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};