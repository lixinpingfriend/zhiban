update pm_duty_join set

carry_id = ${fld:carry_id},
carry_date = to_timestamp('${def:timestamp}','yyyy-MM-dd HH24:MI:ss.ff'),
tool_condition = ${fld:tool_condition},
sanitation_condition = ${fld:sanitation_condition},
fire_condition = ${fld:fire_condition},
remark= ${fld:remark}
where 
	tuid = ${fld:tuid}