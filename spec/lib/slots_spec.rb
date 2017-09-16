describe 'Slots' do
  before(:each) do
    # jugador\slot:     1 2 3
    # luis              x x x
    # alex              x x
    # manuel            x x
    @players = Factories::Players.create([
        {'name' => 'luis', 'uuid' => 'luis_uuid'},
        {'name' => 'alex', 'uuid' => 'alex_uuid'},
        {'name' => 'manuel', 'uuid' => 'manuel_uuid'}
    ])
    actions_hashes = [
      {slot: 'slot_1', player: 'luis_uuid', name: "search", payload: {location: "", resource: ""}},
      {slot: 'slot_1', player: 'alex_uuid', name: "search", payload: {location: "", resource: ""}},
      {slot: 'slot_1', player: 'manuel_uuid', name: "search", payload: {location: "", resource: ""}},
      {slot: 'slot_2', player: 'luis_uuid', name: "search", payload: {location: "", resource: ""}},
      {slot: 'slot_2', player: 'alex_uuid', name: "search", payload: {location: "", resource: ""}},
      {slot: 'slot_2', player: 'manuel_uuid', name: "search", payload: {location: "", resource: ""}},
      {slot: 'slot_3', player: 'luis_uuid', name: "search", payload: {location: "", resource: ""}}
    ]
    @slots = Factories::Slots.create(actions_hashes, @players)
  end

  it 'should compute the number of completed slots' do
    expect(@slots.completed_number).to equal(2)
  end

  it 'should get the completed slots' do
    expect(@slots.completed_ones).to eq(
      [@slots['slot_1'], @slots['slot_2']]
    )
  end

  it 'should get the completed slots for a player' do
    expect(@slots.completed_number_for 'luis_uuid').to eq(3)
    expect(@slots.completed_number_for 'alex_uuid').to eq(2)
  end

  it 'should get the maximum slots available' do
    expect(@slots.max_completed).to eq(3)
  end
end
