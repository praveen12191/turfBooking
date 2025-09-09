import React from "react";
import { ArrowLeft } from "lucide-react";
import { Game } from "../types";

interface GameSelectionProps {
  games: Game[];
  onGameSelect: (game: Game) => void;
  onBack: () => void;
}

const GameSelection: React.FC<GameSelectionProps> = ({
  games,
  onGameSelect,
  onBack,
}) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/media-6.jfif')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="bg-white/20 backdrop-blur-md shadow-lg border-b border-white/30 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
              >
                <ArrowLeft className="h-6 w-6 text-white drop-shadow-lg" />
              </button>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                Select Your Game
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Choose Your Sport
            </h2>
            <p className="text-lg text-gray-200 drop-shadow-md">
              Select from our premium sports facilities
            </p>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => onGameSelect(game)}
                className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20"
              >
                {/* Game Image */}
                <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                {/* Game Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {game.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-semibold">
                      {game.courts} Court{game.courts > 1 ? "s" : ""} Available
                    </span>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white text-sm font-medium">
                        Book Now
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white rounded-full p-3">
                    <svg
                      className="w-8 h-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Booking Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <strong className="text-gray-900">Time Slots:</strong>{" "}
                  30-minute intervals
                </div>
                <div>
                  <strong className="text-gray-900">Availability:</strong> 24/7
                  booking
                </div>
                <div>
                  <strong className="text-gray-900">Cancellation:</strong> Up to
                  2 hours before
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GameSelection;
