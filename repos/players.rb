module Repos
  class Players
    class << self

      def for db
        @@players_collection = db['players']

        @@players_collection.indexes.create_many([
          { key: {uuid: 1 }},
          { key: {game: 1 }},
          { key: {game: 1, uuid: 1 }},
          { key: {game: 1, name: 1 }}
        ])
      end

      def add game_uuid, player_uuid, player_name, type = :human
        @@players_collection.insert_one({
          game: game_uuid,
          uuid: player_uuid,
          name: player_name,
          type: type
        })
      end

      def name_exists? game_uuid, player_name
        @@players_collection.count(game: game_uuid, name: player_name) > 0
      end

      def player_exists? game_uuid, player_uuid
        @@players_collection.count(game: game_uuid, uuid: player_uuid) > 0
      end

      def grab game_uuid
        @@players_collection.find(game: game_uuid).to_a
      end

      def list player_uuid
        @@players_collection.find({uuid: player_uuid}, {fields: ["game"]}).map { |game|  game['game']}
      end

      def get_name game_uuid, player_uuid
        @@players_collection.find({
          game: game_uuid,
          uuid: player_uuid
        }).limit(1).first['name']
      end
    end
  end
end
