

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-gaming-accent/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-gaming-accent rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="mt-4 text-gray-400">Chargement en cours...</p>
    </div>
  );
} 