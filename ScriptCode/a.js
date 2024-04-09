	var fromValue2 = function(v)
	{
		var ret =[0,0,0,0];
		switch(pref.unitMode)
		{
			case 0:
				ret[0] = v[0].mmToPoint();
				ret[1] = v[1].mmToPoint();
				ret[2] = v[2].mmToPoint();
				ret[3] = v[3].mmToPoint();
				break;
			case 1:
				ret[0] = v[0];
				ret[1] = v[1];
				ret[2] = v[2];
				ret[3] = v[3];
				break;
			case 2:
				ret[0] = v[0].pxToMM(pref.dpi).mmToPoint();
				ret[1] = v[1].pxToMM(pref.dpi).mmToPoint();
				ret[2] = v[2].pxToMM(pref.dpi).mmToPoint();
				ret[3] = v[3].pxToMM(pref.dpi).mmToPoint();
				break;
		}
		return ret;
	}