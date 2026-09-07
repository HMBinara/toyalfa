import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, readonly = false, size = 18 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange && onChange(star)}
          className={`transition ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <Star
            size={size}
            className={star <= value ? 'text-amber-400' : 'text-gray-200'}
            fill={star <= value ? 'currentColor' : 'none'}
            strokeWidth={star <= value ? 0 : 1.5}
          />
        </button>
      ))}
    </div>
  );
}
