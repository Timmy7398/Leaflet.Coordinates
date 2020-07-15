L.NumberFormatter = {

	src: "+proj=longlat +datum=WGS84 +no_defs", // Projection WGS84

	round: function(num, dec, sep) {
		var res     = L.Util.formatNum(num, dec) + "",
			numbers = res.split(".");

		if (numbers[1]) {
			var d = dec - numbers[1].length;
			
			for (; d > 0; d--) {
				numbers[1] += "0";
			}

			res = numbers.join(sep || ".");
		}

		return res;
	},

	toDMS: function(deg) {
		var dir      = (deg < 0) ? "-" : "";
		var d        = Math.floor(Math.abs(deg)),
		    minfloat = (Math.abs(deg) - d) * 60,
		    m        = Math.floor(minfloat),
		    secfloat = (minfloat - m) * 60,
			s        = Math.round(secfloat);

			
		m += Math.floor(s/60);
		d += Math.floor(m/60);

		s = ('0' + (s % 60)).slice(-2);
		m = ('0' + (m % 60)).slice(-2);
		
		return ("" + dir + d + "&deg; " + m + "' " + s + "''");
	},

	zoneUTM: function(latLng){
		const north = ['N','P','Q','R','S','T','U','V','W','X']; // Zones North Equator
		const south = ['M','L','K','J','H','G','F','E','D','C']; // Zones South Equator
		const zone  = Math.ceil((Math.round(latLng.lng) + 180) / 6);
		
		let lat  = Math.round(latLng.lat);
		let i    = Math.abs((lat - (lat % 8)) / 8);

		return { 
			zone: zone, 
			part: (lat > 0) ? north[i] : south[i],
		}
		 
	},

	toUTM: function(latLng) {
		const zone  = this.zoneUTM(latLng);
		const south = latLng.lat < 0 ? "+south" : "";
		const dest  = '+proj=utm +zone='+zone.zone+' ' + south + ' +datum=WGS84 +units=m +no_defs';

		return {...zone, ...{proj: proj4['default'](src,dest,[lng,lat])}};
	},

	createValidNumber: function(num, sep) {
		if (!num || num.length === 0) {
			return undefined;
		}

		var numbers = num.split(sep || ".");
		var numRes;
		
		try {
			if (isNaN((numRes = Number(numbers.join("."))))) {
				throw new Error();
			}
		} catch (e) {
			return undefined;
		}

		return numRes;
	}
};