L.NumberFormatter = {
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