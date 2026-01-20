"use client";

import Image from 'next/image';
import { Play } from 'lucide-react';

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  duration: string;
  views?: string;
  url: string;
}

interface VideoSectionProps {
  videos: Video[];
  title?: string;
}

const VideoSection = ({ videos, title = "Nos dernières vidéos" }: VideoSectionProps) => {
  const mainVideo = videos[0];
  const sideVideos = videos.slice(1, 4);

  return (
    <section className="mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 border-l-4 border-gaming-accent pl-3 sm:pl-4">
        {title}
      </h2>
      
      <div className="space-y-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
        {/* Main video */}
        {mainVideo && (
          <div className="lg:col-span-2">
            <a href={mainVideo.url} className="group relative bg-gaming-dark-card rounded-xl overflow-hidden cursor-pointer block">
              <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                <Image 
                  src={mainVideo.thumbnail} 
                  alt={mainVideo.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gaming-accent rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 text-gaming-dark fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs">
                  {mainVideo.duration}
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-gaming-accent transition-colors">
                  {mainVideo.title}
                </h3>
                {mainVideo.views && (
                  <p className="text-gray-400 text-sm">{mainVideo.views} vues</p>
                )}
              </div>
            </a>
          </div>
        )}

        {/* Side videos */}
        <div className="space-y-3 sm:space-y-4">
          {sideVideos.map((video) => (
            <a 
              key={video.id}
              href={video.url}
              className="group flex bg-gaming-dark-card rounded-lg overflow-hidden hover:bg-gaming-dark-lighter transition-colors cursor-pointer"
            >
              <div className="relative w-20 h-16 sm:w-24 sm:h-16 flex-shrink-0">
                <Image 
                  src={video.thumbnail} 
                  alt={video.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Play className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-current" />
                </div>
                <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1 text-xs rounded">
                  {video.duration}
                </div>
              </div>
              <div className="p-2 sm:p-3 flex-1 min-w-0">
                <h4 className="text-white text-xs sm:text-sm font-medium line-clamp-2 group-hover:text-gaming-accent transition-colors">
                  {video.title}
                </h4>
                {video.views && (
                  <p className="text-gray-400 text-xs mt-1">{video.views} vues</p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection; 