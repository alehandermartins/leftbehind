require_relative '../context/player'
require_relative '../context/players'

module Factories
  class Players
    class << self
      def create(players_hashes, random_generator)
        roles = %i(captain pilot mechanic scientist).shuffle(random: random_generator)
        players_hashes.each_with_index do |player_hash, index|
          player_hash['role'] = roles[index]
        end

        players = players_hashes.map do |player_hash|
          information = Information.new(players_hashes)
          ::Player.new(player_hash['uuid'], player_hash['name'], player_hash['role'], information)
        end
        ::Players.new(players)
      end
    end
  end
end
