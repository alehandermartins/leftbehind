module Services
  MAXIMUM_PLAYERS = 4
  MINIMUM_NEEDED_PLAYERS = 1

  class Games
    class << self
      def create name, type, password, host
        raise LB::Invalid::GameName if Repos::Games.repeated? name
        Repos::Games.create name, type, password, host
      end

      def add_player game, new_player, type = :human
        raise LB::Invalid::Game unless Repos::Games.exists? game
        players = Repos::Players.grab game
        raise LB::Invalid::Game if players.count == MAXIMUM_PLAYERS
        raise LB::Invalid::Player if players.any? { |player| player["uuid"] == new_player["uuid"] }
        raise LB::Invalid::Name if players.any? { |player| player["name"] == new_player["name"] }
        Repos::Games.fill game if players.count == (MAXIMUM_PLAYERS - 1)
        Repos::Players.add game, new_player["uuid"], new_player["name"], type
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
        uuids = players(game[:uuid]).map { |player| player["uuid"] }
        Services::Http.notify uuids, game[:uuid]
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
