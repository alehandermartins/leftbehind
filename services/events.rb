module Events
	class << self
		def run context, current_slot
			events = Hash.new
			players = context.players.to_a
			deliver_sidequests players, context.random_generator

      crash players if current_slot >= 58
      arrest players if current_slot >= 52
      androidQuest players, events
      betrayerQuest players, events
      noQuest players, events
      
      events
    end

    def deliver_sidequests players, random_generator
      sidequests = [:android, :betrayer].shuffle(random: random_generator)
      sidequests.each_with_index { |sidequest, indx|
        next unless players[indx]
      	next unless players[indx].sidequest.nil?
        players[indx].sidequest = sidequest
      }
    end

    def crash players
      players.each{ |player|
        player.status = :crash if player.alive?
      }
    end

    def arrest players
      return unless players.any? { |player| player.code }
      players.each{ |player|
        player.status = :arrested if player.alive? && !player.code
        player.status = :indulged if player.alive? && player.code
      }
    end

    def androidQuest players, events
    	player = players.detect { |player| player.sidequest == :android }
    	return if player.nil?
      events[player.uuid] = :fusion if !player.events.include?(:fusion)
      events[player.uuid] = :inject if player.events.include?(:fusion) && !player.events.include?(:inject) 
      events[player.uuid] = :android if player.traits.include?(:android) && !player.events.include?(:android) 
    	events[player.uuid] = :defaultEvent if events[player.uuid].nil?
    end

    def betrayerQuest players, events
    	player = players.detect { |player| player.sidequest == :betrayer }
    	return if player.nil?
      events[player.uuid] = :fusion if !player.events.include?(:fusion)
    	events[player.uuid] = :betray if player.events.include?(:fusion) && !player.events.include?(:betray)
    	events[player.uuid] = :gunsmith if player.traits.include?(:betrayer) && !player.events.include?(:gunsmith) 
      hitman(players, player, events) if player.inventory.has_key?(:gun) && !player.events.include?(:hitman) 
    	events[player.uuid] = :defaultEvent if events[player.uuid].nil?
    end

    def hitman players, betrayer, events
      events[betrayer.uuid] = :hitman
      target = players.detect { |player| player.uuid == betrayer.target }
      target.information.add_trait betrayer.uuid, :betrayer
      events[target.uuid] = :hitman
    end

    def noQuest players, events
      players.each{ |player|
        events[player.uuid] = :defaultEvent if events[player.uuid].nil?
      }
    end
	end
end