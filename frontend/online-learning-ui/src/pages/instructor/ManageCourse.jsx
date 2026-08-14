import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseByIdAPI, createSectionAPI, createLessonAPI, updateCourseAPI } from '../../services/courseService';
import toast from 'react-hot-toast';
import { FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const ManageCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState(null);

  // Section form
  const [sectionForm, setSectionForm] = useState({ title: '', order: 1 });
  const [addingSection, setAddingSection] = useState(false);

  // Lesson form
  const [lessonForm, setLessonForm] = useState({ title: '', videoUrl: '', duration: 0, order: 1, isFree: false });
  const [addingLessonTo, setAddingLessonTo] = useState(null);

  const fetchCourse = async () => {
    try {
      const { data } = await getCourseByIdAPI(id);
      setCourse(data.data);
    } catch {
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourse(); }, [id]);

  const handleAddSection = async (e) => {
    e.preventDefault();
    try {
      await createSectionAPI(id, sectionForm);
      toast.success('Section added!');
      setSectionForm({ title: '', order: (course?.sections?.length || 0) + 1 });
      setAddingSection(false);
      fetchCourse();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add section');
    }
  };

  const handleAddLesson = async (e, sectionId) => {
    e.preventDefault();
    try {
      await createLessonAPI(sectionId, lessonForm);
      toast.success('Lesson added!');
      setLessonForm({ title: '', videoUrl: '', duration: 0, order: 1, isFree: false });
      setAddingLessonTo(null);
      fetchCourse();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add lesson');
    }
  };

  const handlePublish = async () => {
    try {
      await updateCourseAPI(id, { isPublished: !course.isPublished });
      toast.success(course.isPublished ? 'Course unpublished' : 'Course published!');
      fetchCourse();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update course');
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!course) return <div className="text-center py-12 text-gray-500">Course not found</div>;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/instructor/dashboard')} className="text-gray-500 hover:text-gray-700">← Back</button>
          <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
        </div>
        <button
          onClick={handlePublish}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${course.isPublished ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
        >
          {course.isPublished ? 'Unpublish' : 'Publish Course'}
        </button>
      </div>

      {/* Course Info */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex gap-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{course.sections?.length || 0}</p>
          <p className="text-xs text-gray-500">Sections</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{course.totalLessons}</p>
          <p className="text-xs text-gray-500">Lessons</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">₹{course.price}</p>
          <p className="text-xs text-gray-500">Price</p>
        </div>
        <div className="text-center">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${course.isPublished ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
            {course.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Course Content</h2>
          <button
            onClick={() => setAddingSection(!addingSection)}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-blue-700"
          >
            <FiPlus size={14} /> Add Section
          </button>
        </div>

        {/* Add Section Form */}
        {addingSection && (
          <form onSubmit={handleAddSection} className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            <div className="flex gap-3">
              <input
                type="text"
                value={sectionForm.title}
                onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                placeholder="Section title e.g. Introduction"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                value={sectionForm.order}
                onChange={(e) => setSectionForm({ ...sectionForm, order: Number(e.target.value) })}
                placeholder="Order"
                className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                Add
              </button>
              <button type="button" onClick={() => setAddingSection(false)} className="text-gray-500 px-3 py-2 text-sm hover:text-gray-700">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Sections List */}
        {course.sections?.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">No sections yet. Add your first section!</div>
        ) : (
          course.sections?.map((section) => (
            <div key={section.id} className="border-b border-gray-100 last:border-0">
              {/* Section Header */}
              <div
                className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
              >
                <div className="flex items-center gap-3">
                  {expandedSection === section.id ? <FiChevronUp /> : <FiChevronDown />}
                  <span className="font-medium text-gray-800">{section.title}</span>
                  <span className="text-xs text-gray-500">{section.lessons?.length || 0} lessons</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setAddingLessonTo(section.id); setExpandedSection(section.id); }}
                  className="text-blue-600 text-sm hover:text-blue-700 flex items-center gap-1"
                >
                  <FiPlus size={14} /> Add Lesson
                </button>
              </div>

              {/* Lessons */}
              {expandedSection === section.id && (
                <div className="bg-gray-50 px-6 pb-4">
                  {section.lessons?.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-700">📹 {lesson.title}</span>
                      <div className="flex items-center gap-2">
                        {lesson.isFree && <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Free</span>}
                        <span className="text-xs text-gray-500">{lesson.duration} min</span>
                      </div>
                    </div>
                  ))}

                  {/* Add Lesson Form */}
                  {addingLessonTo === section.id && (
                    <form onSubmit={(e) => handleAddLesson(e, section.id)} className="mt-3 space-y-3 bg-white p-4 rounded-lg border border-gray-200">
                      <input
                        type="text"
                        value={lessonForm.title}
                        onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                        placeholder="Lesson title"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="url"
                        value={lessonForm.videoUrl}
                        onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                        placeholder="Video URL (optional)"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex gap-3">
                        <input
                          type="number"
                          value={lessonForm.duration}
                          onChange={(e) => setLessonForm({ ...lessonForm, duration: Number(e.target.value) })}
                          placeholder="Duration (mins)"
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                        />
                        <input
                          type="number"
                          value={lessonForm.order}
                          onChange={(e) => setLessonForm({ ...lessonForm, order: Number(e.target.value) })}
                          placeholder="Order"
                          className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isFree"
                          checked={lessonForm.isFree}
                          onChange={(e) => setLessonForm({ ...lessonForm, isFree: e.target.checked })}
                          className="rounded"
                        />
                        <label htmlFor="isFree" className="text-sm text-gray-600">Free preview lesson</label>
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                          Add Lesson
                        </button>
                        <button type="button" onClick={() => setAddingLessonTo(null)} className="text-gray-500 px-3 py-2 text-sm hover:text-gray-700">
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageCourse;
