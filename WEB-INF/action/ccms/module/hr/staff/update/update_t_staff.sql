UPDATE
	hr_staff
SET
	name=${fld:name}
	,user_pinyin=${fld:user_pinyin}
	,sex=${fld:sex}
	,birthday=${fld:birthday}
	,address=${fld:address}
	,card_no = ${fld:card_no}
	,entry_date = ${fld:entry_date}
	,contract_from = ${fld:contract_from}
	,contract_end = ${fld:contract_end}
	,hourly_rate = ${fld:hourly_rate}
	,remark = ${fld:remark}
	,email = ${fld:email}
	,mobile = ${fld:mobile}
	,staff_category = ${fld:staff_category}
	,parent_user = ${fld:vipuserlogin}
WHERE
	userlogin	= ${fld:tuid}