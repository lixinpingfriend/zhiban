DELETE FROM
	hr_authority_relation
where 
	group_id=${fld:group_id}
and 
	cast(access_type as int)=${fld:access_type}