Achievements = {
	'fly-like-a-bubble': {
		'name': 'Fly like a bubble',
		'description': 'Get an hot-air balloon',
		'multiplierIncrement': 5,
		'check': function(){
			return Core.hasUpgrade('hot-air-balloon')
		}
	},
	'speed-limit': {
		'name': 'Speed limit',
		'description': 'Rebase the 61 m/s',
		'multiplierIncrement': 5,
		'check': function(){
			return Stats.increment * Stats.multiplier * Stats.megamultiplier >= 61
		}
	},
	'speed-of-light': {
		'name': 'Speed of light',
		'description': 'Reach the speed of light (299.79 Mm/s)',
		'multiplierIncrement': 50,
		'check': function(){
			return Stats.increment * Stats.multiplier * Stats.megamultiplier >= 299792000
		}
	},
	'aperture-science': {
		'name': 'Aperture Science',
		'description': 'Travel trough portals',
		'multiplierIncrement': 20,
		'check': function(){
			return Core.hasUpgrade('portal')
		}
	},
	'like-a-worm': {
		'name': 'Like a worm',
		'description': 'Cross a wormhole',
		'multiplierIncrement': 50,
		'check': function(){
			return Core.hasUpgrade('wormhole')
		}
	},
	'unleash-the-mind': {
		'name': 'Unleash the mind',
		'description': '???',
		'multiplierIncrement': 100,
		'check': function(){
			return Core.hasUpgrade('falismind')
		}
	},
  'boostx5': {
    'name': 'Boosted x5',
    'description': 'Use the boost bar 5 times',
    'multiplierIncrement': 2,
    'check': function(){
      return Stats.boostbarTimesFilled >= 5
    }
  },
  'boostx15': {
    'name': 'Boosted x15',
    'description': 'Use the boost bar 15 times',
    'multiplierIncrement': 5,
    'check': function(){
      return Stats.boostbarTimesFilled >= 15
    }
  },
  'boostx50': {
    'name': 'Boosted x50',
    'description': 'Use the boost bar 50 times',
    'multiplierIncrement': 20,
    'check': function(){
      return Stats.boostbarTimesFilled >= 50
    }
  },
  'rest': {
    'name': 'Take a break',
    'description': 'Rest for the first time',
    'multiplierIncrement': 1,
    'check': function(){
      return Stats.rests >= 1
    }
  },
  'rest2': {
    'name': 'Take a break 10 times',
    'description': 'Rest for the tenth time',
    'multiplierIncrement': 5,
    'check': function(){
      return Stats.rests >= 10
    }
  },
  'rest3': {
    'name': 'Take a break 20 times',
    'description': 'Rest for the twentieth time',
    'multiplierIncrement': 10,
    'check': function(){
      return Stats.rests >= 20
    }
  },
  'jonda': {
    'name': 'In da Jonda',
    'description': 'Get in the Jonda',
    'multiplierIncrement': 50,
    'check': function(){
      return Core.hasUpgrade('thejonda')
    }
  },
  'meetfali': {
    'name': 'Meet Fali',
    'description': 'Meet Fali',
    'multiplierIncrement': 0,
    'check': function(){
      return Core.hasUpgrade('falismind')
    }
  },
  'nowwhat': {
  	'name': 'Now what?',
  	'description': 'Buy all upgrades and learnings in the game',
  	'multiplierIncrement': 0,
  	'check': function(){
  		return Core.allUpgradesBought && Shop.allLearningsBought
  	}
  }
}
