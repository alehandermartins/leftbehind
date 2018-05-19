require_relative '../context/player'
require_relative '../context/players'

module Factories
  class Players
    class << self
      def create(players_hashes, random_generator)
        deliver_sidequests players_hashes, random_generator
        players = players_hashes.map do |player_hash|
          information = Information.new(players_hashes)
          ::Player.new(player_hash['uuid'], player_hash['name'], player_hash['role'], player_hash['sidequest'], information)
        end
        ::Players.new(players)
      end

      def deliver_sidequests players_hashes, random_generator
        sidequests = [:android, :betrayer].shuffle(random: random_generator)
        sidequests.each_with_index { |sidequest, indx|
          players_hashes[indx]['sidequest'] = sidequest
        }
      end
    end
  end
end
