module Repos
  class Games
    class << self
      def for db
        @@games_collection = db['games']
        @@games_collection.indexes.create_one(uuid: 1)
      end

      def create game_name, type, password, host
        game_uuid = SecureRandom.uuid
        save game_name, game_uuid, type, password, host
        game_uuid
      end

      def save game_name, game_uuid, type, password, host
        @@games_collection.insert_one({
          name: game_name,
          uuid: game_uuid,
          type: type,
          password: password,
          status: 'ready',
          host: host,
          style: 'gentle'
        })
      end

      def name game_uuid
        @@games_collection.find({uuid: game_uuid }).to_a.first['name']
      end

      def game game_uuid
        result = @@games_collection.find(uuid: game_uuid).limit(1).first
        Util.string_keyed_hash_to_symbolized result
      end

      def exists? game_uuid
        @@games_collection.count(uuid: game_uuid) > 0
      end

      def repeated? game_name
        @@games_collection.count(name: game_name) > 0
      end

      def list
        results = @@games_collection.find.to_a
        results.each{ |result| result.delete('password')}
      end

      def fill game
        @@games_collection.update_one({uuid: game[:uuid]},{
          "$set": {
            "status": "full"
          }
        })
      end

      def start game
        @@games_collection.update_one({uuid: game[:uuid]},{
          "$set": {
            "status": "ongoing",
            "time": Time.now.to_i,
            "lapse": game[:lapse] || 30,
            "style": game[:style] || :gentle
          }
        })
      end

      def save_time game, time = nil
        time = time || Time.now.to_i
        @@games_collection.update_one({uuid: game},{
          "$set": {
            "time": time
          }
        })
      end

      def end game
        @@games_collection.update_one({uuid: game},{
          "$set": {
            "status": "ended"
          }
        })
      end
    end
  end
end
