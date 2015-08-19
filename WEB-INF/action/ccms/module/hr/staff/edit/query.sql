SELECT
	s.userlogin,
	s.name,
	s.sex,
	s.birthday,
	s.address,
	s.card_no,
	s.entry_date,
	s.contract_from,
	s.contract_end,
	s.hourly_rate,
	s.remark,
	s.email,
	s.userlogin as tuid,
	s.user_id,
	u.locale,
	s.mobile,
	s.staff_category,
	s.parent_user,
	(select name from hr_staff where userlogin = s.parent_user ) as names,
	s.staff_category,
	s.user_pinyin
	
FROM
	hr_staff s
	inner join ${schema}s_user u on s.userlogin=u.userlogin
WHERE
	s.userlogin = ${fld:id}