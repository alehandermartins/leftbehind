module LB

  def self.actions_map
    #order priorizes action
    {
      'playdead' => LB::Action::PlayDead,
      'none' => LB::Action::None,
      'defend' => LB::Action::Defend,
      'escape' => LB::Action::Escape,
      'disconnectandroid' => LB::Action::DisconnectAndroid,
      'hackandroid' => LB::Action::HackAndroid,
      'work' => LB::Action::Work,
      'craft' => LB::Action::Craft,
      'search' => LB::Action::Search,
      'oxygen' => LB::Action::Oxygen,
      'hack' => LB::Action::Hack,
      'share' => LB::Action::Share,
      'unlock' => LB::Action::Unlock,
      'steal' => LB::Action::Steal,
      'spy' => LB::Action::Spy,
      'eat' => LB::Action::Eat,
      'vote' => LB::Action::Vote,
      'fusion' => LB::Action::Fusion,
      'inject' => LB::Action::Inject,
      'android' => LB::Action::Android,
      'betray' => LB::Action::Betray,
      'gunsmith' => LB::Action::Gunsmith,
      'hitman' => LB::Action::Hitman,
      'brainscan' => LB::Action::BrainScan
    }
  end

  module Action
    class Base < Struct.new 'Action', :performer, :slot, :payload

      def ensure_context ctx
        @context ||= ctx
      end

      def run context
        @context = context
      end

      def resolve context
        @context = context
      end

      def result
        @result
      end

      def status
        @result[:status]
      end

      def bounty
        @result[:bounty]
      end

      def info
        @result[:info]
      end

      def add_status new_status
        @result = @result || {}
        @result[:status] = new_status
      end

      def add_bounty new_bounty = {}
        @result = @result || {}
        @result[:bounty] = new_bounty
      end

      def add_info message
        @result = @result || {}
        @result[:info] = @result[:info] || {}
        @result[:info].merge! message
      end

      def information action = nil
        action ||= self.class.name
        return {
          action: action,
          payload: payload,
          result: result
        }
      end

      def log_to_everyone player = nil, info = nil
        player ||= performer
        info ||= information
        @context.players.each{ |the_player|
          next unless the_player.alive?
          the_player.information.add_action player.uuid, slot, info
        }
      end

      def log_trait_to_everyone trait
        @context.players.each{ |the_player|
          next unless the_player.alive?
          the_player.information.add_trait performer.uuid, trait
        }
      end

      def add_event_to_everyone event
        @context.players.each{ |the_player|
          the_player.add_event event
        }
      end

      def computed?
        !@result.nil?
      end

      def success?
        computed? && @result[:status] == :success
      end

      def resolved?
        computed? && (result[:status] == :resolved || result[:status] == :fail)
      end

      def to_h
        super.merge({
          result: result,
          type: self.class
        })
      end
    end
  end
end
