/*
CUBEjs Query module
CUBEjs Query API : https://cube.dev/docs/getting-started-cubejs-schema
*/

var barQuery1 = {
	measures: ["discover.count"],
	timeDimensions: [{
		dimension: "discover.readTime",
		granularity: "hour",
		dateRange: 'Today'
	}]
};

var probeCnt = {
	measures: ["probe.count"],
	timeDimensions: [{
		dimension: "probe.readTime",
		granularity: "hour",
		dateRange: 'from 6 days ago to now'
	}]
};

var macModelCnt = {
	measures: ["macdb.count"],
	dimensions: ["macdb.model"],
	limit: 9,
	filters: [{
			dimension: "macdb.model",
			operator: "notEquals",
			values: ["null"]
		},
		{
			dimension: "macdb.model",
			operator: "notContains",
			values: ["Unknown", "Mobile"]
		}
	]
};

var barQuery4 = {
	measures: ["probe.count"],
	timeDimensions: [{
		dimension: "probe.readTime",
		granularity: "hour",
		dateRange: "Today"
	}]
};

var stationCnt = {
	measures: ["station.count"],
	timeDimensions: [{
		dimension: "station.readTime",
		granularity: "hour",
		dateRange: 'from 6 days ago to now'
	}]
};

var discoverCnt = {
	measures: ["discover.count"],
	timeDimensions: [{
		dimension: "discover.readTime",
		granularity: "hour",
		dateRange: 'from 6 days ago to now'
	}]
};

var discoverCnt_day = {
	measures: ["discover.count"],
	timeDimensions: [{
		dimension: "discover.readTime",
		granularity: "day",
		dateRange: 'from 6 days ago to now'
	}]
};

var vulnDiffCnt = {
	measures: [
		"vulnDiffscan.count"
	],
	timeDimensions: [{
		dimension: "vulnDiffscan.readTime",
		granularity: "hour",
		dateRange: 'from 6 days ago to now'
	}]
};

var donutQuery1 = {
	measures: ["vulnscan.count"],
	timeDimensions: [{
		dimension: "vulnscan.readTime"
	}],
	dimensions: ["vulnscan.portid"],
	order: {
		'vulnscan.count': 'desc'
	},
	limit: 10,
	filters: [{
		dimension: "vulnscan.portid",
		operator: "notEquals",
		values: ["0"]
	}]
};

var macManfCnt = {
	measures: ["macdb.count"],
	dimensions: ["macdb.manuf"],
	limit: 10
};

var pieQuery1 = {
	measures: ["vulnscan.count"],
	timeDimensions: [{
		dimension: "vulnscan.readTime"
	}],
	order: {
		'vulnscan.count': 'desc'
	},
	limit: 10,
	dimensions: ["vulnscan.servicename"],
	filters: [{
		dimension: "vulnscan.servicename",
		operator: "notEquals",
		values: ["null", "Unknown"]
	}]
};

var macTypeCnt = {
	measures: ["macdb.count"],
	dimensions: ["macdb.type"],
	limit: 10,
	filters: [{
			dimension: "macdb.type",
			operator: "notEquals",
			values: ["''"]
		},
		{
			dimension: "macdb.type",
			operator: "notContains",
			values: ["Unknown"]
		}
	]
};

var raderQuery1 = {
	dimensions: ["probe.stationmac", "probe.power"],
	order: {
		'probe.power': 'desc'
	},
	filters: [{
		dimension: "probe.power",
		operator: "notEquals",
		values: ["0"]
	}],
	limit: 5
};

var sensorCnt = {
	measures: ["sensor.count"]
};

var sensorStatus = {
	measures: ["sensor.count"],
	dimensions: ["sensor.status"]
};

var assetEventStatus = {
	measures: ["event_asset.count"],
	dimensions: ["event_asset.action"],
	timeDimensions: [{
		dimension: "event_asset.readTime",
		dateRange: 'from 6 days ago to now'
	}],
};

var sensorStatusCnt = {
	//measures: ["sensor.count"],
	dimensions: ["sensor.conn", "sensor.disconn"],
	// renewQuery: true
};

var vulnCveCnt = {
	dimensions: ["vulnscancve.sensorid", "vulnscancve.cvecnt"],
	order: {
		'vulnscancve.cvecnt': 'desc'
	}
};

var vulnDiffGroupCnt = {
	measures: ["vulnDiffscan.count"],
	timeDimensions: [{
		dimension: "vulnDiffscan.readTime",
		dateRange: 'from 6 days ago to now'
	}],
	dimensions: ["Sensorgroup.text"],
	filters: [{
		dimension: "Sensorgroup.text",
		operator: "set"
	}],
	order: {
		'vulnDiffscan.count': 'desc'
	},
	limit: 10
};

var vulnDiffServiceCnt = {
	measures: ["vulnDiffscan.count"],
	dimensions: ["vulnDiffscan.service"],
	timeDimensions: [{
		dimension: "vulnDiffscan.readTime",
		dateRange: 'from 6 days ago to now'
	}],
	order: {
		'vulnDiffscan.count': 'desc'
	},
	filters: [{
		dimension: "vulnDiffscan.servicename",
		operator: "notContains",
		values: ["Unknown"]
	}],
	limit: 10
};

var deviceCnt = {
	measures: ["device.count"],
	dimensions: ["device.type"],
	limit: 9,
	filters: [{
			dimension: "device.type",
			operator: "notEquals",
			values: ["null"]
		},
		{
			dimension: "device.type",
			operator: "notContains",
			values: ["Unknown", "Mobile"]
		}
	]
};

var cveCnt = {
	measures: ["cve.count"],
	timeDimensions: [{
		dimension: "cve.readTime",
		dateRange: 'from 6 days ago to now'
	}],
	dimensions: ["cve.cveoutput"],
	limit: 10
};

var cnvdCnt = {
	measures: ["cnvd.count"],
	timeDimensions: [{
		dimension: "cnvd.readTime",
		dateRange: "from 6 days ago to now"
	}],
	dimensions: ["cnvd.origin_code"],
	limit: 10
};

var assetType = {
	measures: ["asset.count"],
	dimensions: ["asset.type"],
	renewQuery: true
};

var assetStatus = {
	measures: ["asset.count"],
	// timeDimensions: [{
	// 	dimension: "asset.readTime",
	// 	dateRange: "from 6 days ago to now"
	// }],
	dimensions: ["asset.status"],
	renewQuery: true
};

var assetAllowed = {
	measures: ["asset.count"],
	// timeDimensions: [{
	// 	dimension: "asset.readTime",
	// 	dateRange: "from 6 days ago to now"
	// }],
	dimensions: ["asset.allowed"],
	renewQuery: true
};

var assetTrends = {
	measures: ["assetTrends.detection_count"],
	dimensions: ["assetTrends.detection_time"],
	order: {
		"assetTrends.detection_time": "asc"
	},
};


var fuzzType = {
	measures: ["fuzzerType.count"],
	dimensions: ["fuzzerType.cve_name"],
	order: {
		"fuzzerType.count": "desc"
	},
	renewQuery: true
};

var riskTop3 = {
	measures: ["riskAsset.count"],
	dimensions: ["riskAsset.type"],
	order: {
		"riskAsset.count": "desc"
	},
	renewQuery: true
};

var vulnerabilityTrends = {
	measures: ["vulnerabilityTrends.asset_count"],
	dimensions: ["vulnerabilityTrends.detection_time"],
	order: {
		"vulnerabilityTrends.detection_time": "asc"
	},
	renewQuery: true
}

var wirelessTrends = {
	measures: ["wirelessTrends.ap_cnt", "wirelessTrends.wifi_cnt", "wirelessTrends.bluetooth_cnt"],
	dimensions: ["wirelessTrends.connection_time", "wirelessTrends.sensor_id"],
	order: {
		"wirelessTrends.connection_time": "asc"
	},
	renewQuery: true
}

var wireless1dayTrends = {
	//measures: ["wireless1dayTrends.power"],
	dimensions: ["wireless1dayTrends.power",
		"wireless1dayTrends.connection_time",
		"wireless1dayTrends.asset_type",
		"wireless1dayTrends.asset_name",
		"wireless1dayTrends.mac",
		"wireless1dayTrends.sensor_id"
	],
	renewQuery: true
}

var apWithStationaryTrends = {
	dimensions: [
		"apWithStationaryTrends.sensor_id",
		"apWithStationaryTrends.connection_time",
		"apWithStationaryTrends.connection_count",
	],
	order: {
		"apWithStationaryTrends.connection_time": "asc"
	},
	renewQuery: true
}

var codeTypeVulnerability = {
	measures: ["event_vulnerability.count"],
	timeDimensions: [{
		dimension: "event_vulnerability.readTime",
		dateRange: "from 6 days ago to now"
	}],
	dimensions: ["event_vulnerability.category"],
}

var vulnerabilityTopN = {
	measures: ["event_vulnerability.count"],
	timeDimensions: [{
		dimension: "event_vulnerability.readTime",
		dateRange: "from 6 days ago to now"
	}],
	dimensions: ["event_vulnerability.vulnerability_code"],
	order: {
		"event_vulnerability.count": "desc"
	},
	limit: 5
}

var vulnerabilityEventStatus = {
	measures: ["event_vulnerability.count"],
	dimensions: ["event_vulnerability.action"],
	timeDimensions: [{
		dimension: "event_vulnerability.readTime",
		dateRange: 'from 6 days ago to now'
	}],
};

var network1dayTrends = {
	dimensions: ["network1dayTrends.ap_name", "network1dayTrends.stationary_mac"],
	//1limit: 100,
	renewQuery: true
}

module.exports = {
	barQuery1,
	probeCnt,
	macModelCnt,
	barQuery4,
	stationCnt,
	discoverCnt,
	vulnDiffCnt,
	discoverCnt_day,
	donutQuery1,
	macManfCnt,
	pieQuery1,
	macTypeCnt,
	raderQuery1,
	sensorCnt,
	sensorStatusCnt,
	vulnCveCnt,
	vulnDiffGroupCnt,
	vulnDiffServiceCnt,
	deviceCnt,
	cveCnt,
	cnvdCnt,
	assetType,
	assetStatus,
	assetAllowed,
	assetTrends,
	fuzzType,
	riskTop3,
	vulnerabilityTrends,
	sensorStatus,
	assetEventStatus,
	wirelessTrends,
	wireless1dayTrends,
	apWithStationaryTrends,
	codeTypeVulnerability,
	vulnerabilityTopN,
	vulnerabilityEventStatus,
	network1dayTrends
}
