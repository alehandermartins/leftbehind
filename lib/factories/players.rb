require_relative '../context/player'
require_relative '../context/players'

module Factories
  class Players
    class << self
      def create(players_hashes)
        players = players_hashes.map do |player_hash|
          ::Player.new(player_hash['uuid'], player_hash['name'])
        end
        ::Players.new(players)
      end
    end
  end
end
