module LB
  module Alien

    def devoured?
      return false unless alien_found_player?
      devour
      true
    end

    def alien_found_player?
      payload[:location] == @context.alien.location
    end

    def devour
      performer.devour
      performer.bury slot, 'devoured'
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
