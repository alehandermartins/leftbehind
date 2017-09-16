require 'mongo'
require_relative '../lib/util'
module Repos
  class Actions
    class << self

      def for db
        @@actions_collection = db['actions']

        @@actions_collection.indexes.create_many([
          { key: {game: 1, player: 1, slot: 1}},
          { key: {game: 1}},
          { key: {game: 1, player: 1}}
        ])
      end

      def save data
        @@actions_collection.insert_many data
      end

      def remove game, player, slot
        @@actions_collection.delete_one(game: game, player: player, slot: slot)
      end

      def started? game
        @@actions_collection.count(query: {game: game}) > 0
      end

      def grab  game
        results = @@actions_collection.find(game: game)

        results.map { |action|
          Util.string_keyed_hash_to_symbolized action
        }
      end

      def grab_for player, game
        results = @@actions_collection.find(game: game, player: player)

        results.map { |action|
          Util.string_keyed_hash_to_symbolized action
        }
      end
    end
  end
end
