SELECT
	t.tuid  as item_id
	,t.item_name
	,t.item_code
	,t.is_matrix
	,t.list_show_type
	,t.is_page_break
	,t.show_order
	,t.remark
	,t.is_matrix_transpose
	,t.is_list_mline
	,t.type_id
FROM
	t_term_item t
	inner join t_term_type s
	on t.type_id = s.tuid
WHERE
	s.term_id = ${fld:term_id}
order by
	s.show_order,t.show_order