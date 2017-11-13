module Repos
  class Users
    class << self

      def for db
        @@users_collection = db['users']
      end

      def add user
        @@users_collection.insert_one(user)
      end

      def exists? uuid
        @@users_collection.count(uuid: uuid) > 0
      end

      def grab uuid
        results = @@users_collection.find(uuid: uuid)

        results.map { |user|
          Util.string_keyed_hash_to_symbolized user
        }
      end
    end
  end
end
