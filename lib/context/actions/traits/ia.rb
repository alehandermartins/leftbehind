module LB
  module IA

    def killed?
      return false unless ia_found_player?
      kill
      true
    end

    def ia_found_player?
      payload[:location] == @context.ia.location
    end

    def kill
      performer.ia_kill
      add_status :fail
      add_info action: self.class.name
      @context.slots.replace_actions performer, slot, dead_action
      
      @context.players.each{ |the_player|
        the_player.information.add_to performer.uuid, slot, information('LB::Action::Death')
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
