describe 'Slots factory' do

  it 'builds a list of Slot objects from a list of actions_hashes and a list of players' do
    players = Factories::Players.create([
        {'name' => 'player_name', 'uuid' => 'player_uuid'},
        {'name' => 'otter_player_name', 'uuid' => 'otter_player_uuid'},
        {'name' => 'anotter_player_name', 'uuid' => 'anotter_player_uuid'}
    ])

    actions_hashes = [
      {slot: 'slot_1', player: 'player_uuid', name: "search", payload: {location: "", resource: ""}},
      {slot: 'slot_1', player: 'otter_player_uuid', name: "search", payload: {location: "", resource: ""}},
      {slot: 'slot_2', player: 'player_uuid', name: "search", payload: {location: "", resource: ""}},
      {slot: 'slot_2', player: 'anotter_player_uuid', name: "search", payload: {location: "", resource: ""}},
      {slot: 'slot_3', player: 'player_uuid', name: "search", payload: {location: "", resource: ""}}
    ]

    slots = Factories::Slots.create_list(actions_hashes, players)

    expected_slots(players, actions_hashes).each_with_index do |expected_slot, index|
      expect_slots_are_equal(slots.values[index], expected_slot)
    end
  end

  def create_action(slot_index, players_uuid, action_hashes_index, players, actions_hashes)
    ActionBuilder.new()
      .for(players[players_uuid])
      .at(slot_index)
      .parameterized_with(actions_hashes[action_hashes_index])
      .build()
  end

  def expect_slots_are_equal(actual_slot, expected_slot)
    expect(actual_slot.actions.length).to eql(expected_slot.actions.length)
    actual_slot.actions.each_with_index do |actual_action, index|
      expect(actual_action.performer).to eql(expected_slot.actions[index].performer)
      expect(actual_action.slot).to eql(expected_slot.actions[index].slot)
      expect(actual_action.payload).to eql(expected_slot.actions[index].payload)
    end
  end

  def expected_slots(players, actions_hashes)
    slot1 = Slot.new()
    slot1.add(create_action('slot_1', 'player_uuid', 0, players, actions_hashes))
    slot1.add(create_action('slot_1', 'otter_player_uuid', 1, players, actions_hashes))

    slot2 = Slot.new()
    slot2.add(create_action('slot_2', 'player_uuid', 2, players, actions_hashes))
    slot2.add(create_action('slot_2', 'anotter_player_uuid', 3, players, actions_hashes))

    slot3 = Slot.new()
    slot3.add(create_action('slot_3', 'player_uuid', 4, players, actions_hashes))

    [slot1, slot2, slot3]
  end
end
