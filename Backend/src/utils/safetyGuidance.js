const GUIDANCE = {
  earthquake: {
    title: 'Earthquake Safety',
    do: [
      'Drop, Cover, and Hold On — get under a sturdy table or desk',
      'Stay indoors until the shaking stops',
      'Stay away from windows, glass, and exterior walls',
      'If outside, move to an open area away from buildings and power lines',
      'If driving, pull over to a clear area and stay in the vehicle',
    ],
    dont: [
      'Do not use elevators',
      'Do not run outdoors during shaking',
      'Do not stand near doorways (modern buildings have weaker doorways)',
    ],
    prepare: [
      'Secure heavy furniture to walls',
      'Keep a go-bag with water, food, flashlight, and first aid kit',
      'Identify safe spots in each room',
      'Know how to shut off gas and water mains',
    ],
  },
  flood: {
    title: 'Flood Safety',
    do: [
      'Move to higher ground immediately',
      'Follow evacuation orders from local authorities',
      'Turn off utilities at the main switches if instructed',
      'Disconnect electrical appliances',
    ],
    dont: [
      'Do not walk, swim, or drive through floodwaters — 6" of moving water can knock you over',
      'Do not allow children to play near floodwater',
      'Do not touch electrical equipment if wet or standing in water',
    ],
    prepare: [
      'Elevate furniture and valuables above potential flood levels',
      'Prepare sandbags for doorways',
      'Keep important documents in a waterproof container',
      'Have a battery-powered radio for emergency updates',
    ],
  },
  wildfire: {
    title: 'Wildfire Safety',
    do: [
      'Evacuate immediately when told to do so',
      'Close all windows, doors, and vents',
      'Wear long sleeves, long pants, and a mask or cloth over your face',
      'Take your emergency go-bag and important documents',
      'Keep vehicle fueled and pointed toward the exit',
    ],
    dont: [
      'Do not attempt to outrun the fire on foot uphill',
      'Do not return home until authorities say it is safe',
      'Do not use water hoses — save water for firefighters',
    ],
    prepare: [
      'Create a defensible space of 30+ feet around your home',
      'Remove dry vegetation and debris from gutters',
      'Have an evacuation plan with multiple routes',
      'Keep fire extinguishers accessible',
    ],
  },
  hurricane: {
    title: 'Hurricane Safety',
    do: [
      'Stay indoors away from windows, skylights, and glass doors',
      'Take shelter in a small interior room, closet, or hallway on the lowest floor',
      'Have your emergency kit ready with supplies for at least 72 hours',
      'Follow evacuation orders immediately',
    ],
    dont: [
      'Do not go outside during the eye of the storm — winds will return rapidly',
      'Do not use candles during power outages (use flashlights)',
      'Do not walk or drive through floodwaters',
    ],
    prepare: [
      'Trim trees and secure loose outdoor objects',
      'Install storm shutters or board up windows',
      'Fill bathtubs and containers with water for sanitation',
      'Charge all electronic devices before the storm',
    ],
  },
  tsunami: {
    title: 'Tsunami Safety',
    do: [
      'If you feel strong shaking near the coast, move to high ground immediately',
      'If you see the ocean receding, evacuate immediately — a tsunami is coming',
      'Go to an area at least 100 feet above sea level or 2 miles inland',
      'Stay on high ground until authorities give the all-clear',
    ],
    dont: [
      'Do not wait for an official warning if you feel shaking or see water receding',
      'Do not go to the shoreline to watch the wave',
      'Do not return to low-lying areas until declared safe',
    ],
    prepare: [
      'Know the tsunami evacuation routes in your area',
      'Keep a go-bag ready near the exit',
      'Have a family communication plan',
      'Learn the natural warning signs: strong shaking, receding ocean',
    ],
  },
  tornado: {
    title: 'Tornado Safety',
    do: [
      'Go to the basement or an interior room on the lowest floor',
      'Stay away from windows, doors, and outside walls',
      'Cover your head and neck with your arms and a blanket or mattress',
      'Get under a sturdy table or workbench if available',
    ],
    dont: [
      'Do not stay in a mobile home — find a sturdy building or storm shelter',
      'Do not try to outrun a tornado in a vehicle',
      'Do not seek shelter under an overpass or bridge',
    ],
    prepare: [
      'Identify the safest room in your home (basement, storm cellar, interior closet)',
      'Practice tornado drills with your family',
      'Keep emergency supplies in your shelter room',
      'Install a NOAA weather radio for alerts',
    ],
  },
  volcanic_eruption: {
    title: 'Volcanic Eruption Safety',
    do: [
      'Follow evacuation orders from authorities immediately',
      'Wear long sleeves, long pants, and goggles to protect from ash',
      'Wear a mask or hold a damp cloth over your face',
      'Stay indoors until ash has settled',
    ],
    dont: [
      'Do not drive in heavy ashfall — it clogs engines and reduces visibility',
      'Do not run air conditioning or fans that draw in outside air',
      'Do not approach the eruption area or lava flows',
    ],
    prepare: [
      'Know the evacuation routes from your area',
      'Keep goggles and masks (N95 or better) in your go-bag',
      'Seal doors and windows with damp towels during ashfall',
      'Have plastic sheeting and tape to seal rooms',
    ],
  },
  landslide: {
    title: 'Landslide Safety',
    do: [
      'Move away from the path of the landslide at a right angle',
      'If escape is not possible, curl into a tight ball to protect your head',
      'Watch for broken trees, tilting fences, or unusual water flow',
      'Report the landslide to local authorities',
    ],
    dont: [
      'Do not approach the slide area — secondary slides can occur',
      'Do not build near steep slopes or drainage areas',
      'Do not ignore cracking ground or bulging ground at the base of a slope',
    ],
    prepare: [
      'Consult a geotechnical expert before building on slopes',
      'Plant ground cover on slopes to stabilize soil',
      'Install flexible pipe fittings to avoid gas/water leaks',
      'Watch for warning signs during heavy rainfall',
    ],
  },
}

export default GUIDANCE
