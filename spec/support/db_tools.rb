module LB
  module Test
    module DbTools
      def db
        # config = YAML.load_file './config/config.yml'
        # settings = config[ENV['RACK_ENV']]
        # @connection ||= Mongo::Connection.new( settings['dbhost'], settings['dbport'] ) unless settings['local']
        # @connection ||= Mongo::Connection.new if settings['local']
        # @connection['cg_test'].authenticate settings['dbname'], settings['dbpass'] if settings['auth']

        @connection ||= Mongo::Client.new 'mongodb://127.0.0.1:27017/cg_test'
        @connection.database
      end

      def prepare_db
        Repos::Games.for db
        Repos::Players.for db
        Repos::Actions.for db
      end

      def drop_collections
        db.collections.each{ |c|
          c.drop
        }
        Repos::ActionsInMemory.clear rescue true
      end
    end
  end
end

