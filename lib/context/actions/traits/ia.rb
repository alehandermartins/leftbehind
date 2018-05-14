module LB
  module IA

    def killed?
      return false if !ia_found_player? || betrayer?
      kill
      true
    end

    def betrayer?
      performer.traits.include?(:betrayer)
    end

    def ia_found_player?
      @context.locations[payload[:location]][:status] == :marked
    end

    def kill
      performer.ia_kill
      add_status :fail
      add_info action: self.class.name
      @context.slots.replace_actions performer, slot, dead_action

      @context.players.each{ |the_player|
        the_player.information.add_action performer.uuid, slot, information('LB::Action::Death')
      }
    end

    def dead_action
      {
        name: 'playdead',
        payload: {}
      }
    end
  end
end
