module Repos
  class Users
    class << self

      def for db
        @@users_collection = db['users']
      end

      def add user
        @@users_collection.insert_one(user)
      end

      def update user
        @@users_collection.update_one({uuid: user[:uuid]},{
          "$set": {
            "player_id": user[:player_id]
          },
          {
            "upsert": true,
          }
        })
      end

      def exists? uuid
        @@users_collection.count(uuid: uuid) > 0
      end

      def player_ids uuids
        results = @@users_collection.find(uuid: {"$in"=> uuids})
        results.map { |user|
          user["player_id"]
        }
      end
    end
  end
end
