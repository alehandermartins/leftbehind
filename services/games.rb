module Services
  class Games
    MINIMUM_NEEDED_PLAYERS = 2
    MAXIMUM_PLAYERS = 4
    class << self

      def create name, type, password, host
        raise LB::Invalid::GameName if Repos::Games.repeated? name
        Repos::Games.create name, type, password, host
      end

      def add_player game, player_uuid, player_name, type = :human
        raise LB::Invalid::Game unless Repos::Games.exists? game
        raise LB::Invalid::Game if full? game
        raise LB::Invalid::Player if Repos::Players.player_exists? game, player_uuid
        raise LB::Invalid::Name if Repos::Players.name_exists? game, player_name
        Repos::Players.add game, player_uuid, player_name, type
      end

      def players game
        Repos::Players.grab game
      end

      def ready? game
        raise LB::Invalid::Game unless Repos::Games.exists? game
        players(game).count >= MINIMUM_NEEDED_PLAYERS
      end

      def full? game
        players(game).count == MAXIMUM_PLAYERS
      end

      def start game
        Repos::Games.start game
      end

      def end game
        Repos::Games.end game
      end

      def available
        Repos::Games.list.select { |game|
          # next false if game['public'] != true
          game['status'] == 'ready'
        }
      end

      def ongoing player
        game_uuids = Repos::Players.list player
        Repos::Games.list.select{ |game|
          game_uuids.include? game['uuid']
        }
      end
    end
  end
end
