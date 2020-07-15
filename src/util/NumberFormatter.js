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
		var north = ['N','P','Q','R','S','T','U','V','W','X']; // Zones North Equator
		var south = ['M','L','K','J','H','G','F','E','D','C']; // Zones South Equator
		var zone  = Math.ceil((Math.round(latLng.lng) + 180) / 6);
		
		var lat  = Math.round(latLng.lat);
		var i    = Math.abs((lat - (lat % 8)) / 8);

		var result = {
			zone: zone
		};
		result.part = (lat > 0) ? north[i] : south[i]; 
		
		return result;
	},

	toUTM: function(latLng) {
		var zone  = this.zoneUTM(latLng);
		var south = latLng.lat < 0 ? "+south" : "";
		var dest  = '+proj=utm +zone='+zone.zone+' ' + south + ' +datum=WGS84 +units=m +no_defs';
		var result = Object.assign(zone, {proj: proj4['default'](src,dest,[lng,lat])});

		return result;
	},

	toDMM: function(deg, dec) {
		var dir = deg < 0 ? "-" : "";
		var d = Math.floor(Math.abs(deg)),
			m = (Math.abs(deg) - d) * 60;

		m = Math.round(1000000 * m) / 1000000;
		m = Math.floor(m) == m ? m + ".0" : m.toFixed(dec);
		
		d = ('0' + d).slice(-2);

		return ("" + dir + d + "&deg; " + m);
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