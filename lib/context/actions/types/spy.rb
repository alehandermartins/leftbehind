module LB
  class Action::Spy < Action::Base
    include WithTarget
    include Cooperative
    include EndGame

    def run context
      super context

      escaped_action(self) if target_left_behind?(self)
      trapped_action(self) if target_escaped?(self)
      return @context if computed?

      add_status :success
      @context
    end

    def resolve context
      super context

      (same_actions).each {|same_action|
        same_action.add_info(target_info: same_action.target_info) if same_action.success?
        same_action.performer.information.add_action same_action.performer.uuid, slot, same_action.information
        same_action.add_target_information if same_action.success?
        reveal_sidequest(same_action) if same_action.success?
      }

      @context
    end

    def add_target_information
      target_information = @context.players[target].information
      has_info = target_information.players[target][:actions].has_key?(slot)
      performer.information.add_action target, slot, target_information.players[target][:actions][slot] if has_info
    end

    def reveal_sidequest same_action
      player = same_action.performer
      return unless target_action.class.name == "LB::Action::HackAndroid"
      android = target_action.payload[:target]
      return if player.information.players[android][:traits].include?(:c3po) || player.information.players[android][:traits].include?(:terminator)
      player.information.add_trait android, :terminator
      same_action.add_info warning: true
      same_action.add_info android: android
      same_action.add_info threat: true
      same_action.add_info threat: false if @context.players[android].condition == :ok
    end

    def target_info
      action = target_action
      {
        action: action.class.name,
        payload: action.payload,
        inventory: @context.players[target].inventory.to_h.dup
      }
    end
  end
end
