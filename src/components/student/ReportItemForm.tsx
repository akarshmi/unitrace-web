import React, { useEffect, useState } from 'react';
import { ItemType } from '../../types';
import { itemsApi } from '../../lib/api/items.api';
import { 
  Upload, 
  MapPin, 
  Calendar, 
  Clock, 
  Check, 
  ShieldAlert, 
  AlertCircle 
} from 'lucide-react';

interface ReportItemFormProps {
  type: ItemType;
  onSuccess: () => void;
  onCancel: () => void;
}

const PRESET_LOCATIONS = [
  'Central Library Level 1 - Reference Desk',
  'Central Library Level 2 - Silent Study Zone',
  'Central Library Level 3 - Computer Lab / Stacks',
  'Block 34 - School of Computer Science (Auditorium 2)',
  'Block 34 - Ground Floor Foyer',
  'Student UniMall - Food Court Area',
  'Student UniMall - West Entrance Benches',
  'Law Faculty Building - Reading Hall',
  'Engineering Workshop Complex - Lab 4',
  'Campus Sports Complex & Gymnasium',
  'Main Academic Block 1 - Registrar Concourse'
];

export const ReportItemForm: React.FC<ReportItemFormProps> = ({
  type,
  onSuccess,
  onCancel,
}) => {
  const isLost = type === 'LOST';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(PRESET_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().slice(0, 10));
  const [eventTime, setEventTime] = useState('11:00');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedItemCode, setSubmittedItemCode] = useState<string | null>(null);

  useEffect(() => () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, PNG, GIF, or WEBP images are allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file must be under 5MB.');
        return;
      }
      setError(null);
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Item title is required.');
      return;
    }
    if (title.trim().length > 150) {
      setError('Item title must be 150 characters or fewer.');
      return;
    }

    if (!description.trim() || description.length < 10) {
      setError('Please provide a descriptive explanation (at least 10 characters).');
      return;
    }
    if (description.trim().length > 1000) {
      setError('Description must be 1000 characters or fewer.');
      return;
    }

    if (!imageFile) {
      setError('A valid item image is required.');
      return;
    }

    const finalLocation = customLocation.trim() || location;
    if (finalLocation.length > 255) {
      setError('Location must be 255 characters or fewer.');
      return;
    }
    const eventDateTime = new Date(`${eventDate}T${eventTime}:00`);
    if (Number.isNaN(eventDateTime.getTime()) || eventDateTime.getTime() > Date.now()) {
      setError('Event date and time must be valid and not in the future.');
      return;
    }
    const eventInstant = eventDateTime.toISOString();

    setSubmitting(true);
    try {
      const created = await itemsApi.reportItem({
        title,
        type,
        description,
        location: finalLocation,
        eventFrom: eventInstant,
        eventTo: eventInstant,
        image: imageFile,
      });

      setSubmittedItemCode(created.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report. Please try again.');
      setSubmitting(false);
    }
  };

  if (submittedItemCode) {
    return (
      <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#0B1422] p-8 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3 border-b-2 border-black dark:border-neutral-700 pb-4">
          <div className="w-8 h-8 bg-[var(--navy)] text-white flex items-center justify-center font-bold">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono-numbers uppercase tracking-wider text-[var(--muted)] font-bold">
              Report Confirmed
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-black dark:text-white">
              Reference: {submittedItemCode}
            </h2>
          </div>
        </div>

        {!isLost ? (
          <div className="border-2 border-black dark:border-neutral-700 bg-[var(--surface)] dark:bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--navy)] dark:text-blue-300">
              <ShieldAlert className="w-4 h-4 text-[var(--navy)] dark:text-blue-400" />
              <span>Physical Drop-off Required</span>
            </div>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Please deliver this physical item to the <strong>Security Office (Block 29 Room 102)</strong> before <strong>5:00 PM today</strong>. Show reference number <strong>{submittedItemCode}</strong> to the desk officer.
            </p>
          </div>
        ) : (
          <div className="border-2 border-black dark:border-neutral-800 p-4 bg-white dark:bg-[#0B1422] space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
              AI Matching Activated
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              UniTrace will continuously match your report against items submitted to Campus Security. You will be notified as soon as an officer verifies a match.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t-2 border-black dark:border-neutral-800">
          <button
            onClick={onSuccess}
            className="px-6 py-2.5 bg-[var(--navy)] hover:bg-[var(--navy-hover)] text-white text-xs font-bold uppercase tracking-[0.12em] transition-colors cursor-pointer"
          >
            View My Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div className="border-b-2 border-black dark:border-neutral-800 pb-4">
        <div className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--navy)] dark:text-blue-400 font-mono-numbers mb-1">
          Campus Form 0{isLost ? '1-A' : '2-B'} // UniTrace
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black dark:text-white">
          {isLost ? 'Report Lost Belonging' : 'Report Found Belonging'}
        </h1>
        <p className="text-xs text-[var(--muted)] mt-1">
          {isLost 
            ? 'Provide key details and visual evidence to match against items cataloged by Campus Security.'
            : 'Register an item found on campus. Physical drop-off at the Security Office is required by 5:00 PM.'
          }
        </p>
      </div>

      {error && (
        <div className="border-2 border-black bg-neutral-100 dark:bg-slate-900 p-4 text-xs text-black dark:text-white flex items-center gap-2 font-mono-numbers">
          <AlertCircle className="w-4 h-4 shrink-0 text-[var(--navy)]" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-[#0B1422] p-6 space-y-6">
        
        {/* Title */}
        <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white">
              Item Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Apple MacBook Air M2 (Space Gray)"
              className="w-full px-3 py-2.5 text-sm border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none focus:border-[var(--navy)] font-mono-numbers"
            />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="block text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white">
            Detailed Description & Marks *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe brand, color, stickers, unique scratches, contents, or serial numbers..."
            className="w-full px-3 py-2.5 text-sm border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none focus:border-[var(--navy)]"
          />
        </div>

        {/* Location Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[var(--navy)]" />
              <span>Campus Location *</span>
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none focus:border-[var(--navy)]"
            >
              {PRESET_LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white">
              Specific Room / Landmark
            </label>
            <input
              type="text"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="e.g. Table 14 under reading lamp"
              className="w-full px-3 py-2.5 text-sm border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none focus:border-[var(--navy)]"
            />
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[var(--navy)]" />
              <span>Event Date *</span>
            </label>
            <input
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none focus:border-[var(--navy)] font-mono-numbers"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[var(--navy)]" />
              <span>Approximate Time *</span>
            </label>
            <input
              type="time"
              required
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border-2 border-black dark:border-neutral-700 bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none focus:border-[var(--navy)] font-mono-numbers"
            />
          </div>
        </div>

        {/* Photograph Upload */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-[0.12em] text-black dark:text-white">
            Photograph *
          </label>
          
          <div className="border-2 border-dashed border-black dark:border-neutral-700 p-6 flex flex-col items-center justify-center bg-[var(--surface)] dark:bg-slate-900/50">
            {imagePreview ? (
              <div className="space-y-3 text-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 mx-auto object-cover border-2 border-black dark:border-neutral-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="text-xs text-black dark:text-white underline font-bold uppercase tracking-wider cursor-pointer"
                >
                  Remove Photo
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center cursor-pointer">
                <Upload className="w-7 h-7 text-[var(--navy)] mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider text-black dark:text-white">
                  Click to attach image file
                </span>
                <span className="text-[11px] text-[var(--muted)] mt-1 font-mono-numbers">
                  JPG, PNG, GIF, or WEBP up to 5MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Found Item Notice */}
        {!isLost && (
          <div className="border-2 border-black dark:border-neutral-700 p-4 bg-[var(--surface)] dark:bg-slate-900/60">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--navy)] dark:text-blue-300 mb-1">
              Physical Submission Protocol
            </div>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Found items must be delivered to Campus Security Office (Block 29 Room 102) by <strong>5:00 PM today</strong>.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-black dark:border-neutral-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] border-2 border-black dark:border-neutral-700 text-black dark:text-white bg-white dark:bg-slate-900 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-[0.12em] bg-[var(--navy)] hover:bg-[var(--navy-hover)] text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : isLost ? 'Submit Lost Report' : 'Register Found Item'}
          </button>
        </div>

      </form>
    </div>
  );
};
