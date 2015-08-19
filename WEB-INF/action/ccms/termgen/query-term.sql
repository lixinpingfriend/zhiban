select
	t.term_name,
	t.tuid as term_id,
	to_char({ts '${def:timestamp}'},'yyyy-MM-dd hh24:mi:ss') as start_time,
	t.pre_class,
	t.post_class
from
	t_term t
where
	t.tuid = ${fld:term_id}