const results = db.qc_certificates.aggregate([
    {
        $group: {
            _id: {
                supplier: "$supplier",
                heat_number: "$heat_number"
            },
            total_certificates: { $sum: 1 },
            total_defects: {
                $sum: "$inspection_metrics.defect_flag"
            },
            defect_rate: {
                $avg: "$inspection_metrics.defect_flag"
            },
            mean_tolerance_deviation: {
                $avg: "$inspection_metrics.tolerance_dev"
            },
            tensile_strength_quantiles: {
                $percentile: {
                    input: "$mechanical_properties.tensile_strength_mpa",
                    p: [0.25, 0.5, 0.75],
                    method: "approximate"
                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            supplier: "$_id.supplier",
            heat_number: "$_id.heat_number",
            total_certificates: 1,
            total_defects: 1,
            defect_rate: {
                $round: ["$defect_rate", 4]
            },
            defect_rate_pct: {
                $round: [
                    { $multiply: ["$defect_rate", 100] },
                    2
                ]
            },
            mean_tolerance_deviation: {
                $round: ["$mean_tolerance_deviation", 6]
            },
            tensile_strength_quantiles: 1
        }
    },
    {
        $sort: {
            defect_rate: -1,
            total_certificates: -1
        }
    }
], { allowDiskUse: true });

results.forEach(printjson);