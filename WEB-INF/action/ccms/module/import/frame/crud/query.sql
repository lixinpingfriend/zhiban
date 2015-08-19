select
	concat('c' , t.tuid) as tuid,
	t.rule_name as show_name,
	'0' as superior_id,
	cast(t.tuid as varchar(4000)) as rule_id,
	'parent' as operator,
	'1' as show_order
from 
	t_import_rule t
where
	t.tab_id=${fld:tab_id}

union

select
	concat('j' , t.tuid) as tuid,
	case t.is_node when '0' then
		(case when t.logic_type='and' then '同时满足条件的结果'
			when t.logic_type='or' then '任意满足其中一个条件的结果' 
			else t.clause_code end )
		when '1'  then
		(concat(concat(concat(concat(
			(select max(field_name_cn) as field_name_cn from t_field a,t_import_table b where a.table_id = b.table_id and  a.field_code = t.clause_code  and b.tuid = ${fld:tab_id} )  , '&nbsp;') , 
			case when t.clause_filter='=' then '等于'
			     when t.clause_filter='like' then '包含'
			     when t.clause_filter='>' then '大于'
			     when t.clause_filter='>=' then '大于等于'
			     when t.clause_filter='<' then '小于'
			     when t.clause_filter='<=' then '小于等于'
			     when t.clause_filter='<>' then '不等于'
			     when t.clause_filter='is not null' then '非空'
			     when t.clause_filter='is null' then '为空'
			     when t.clause_filter='in' then '任意满足'
			     when t.clause_filter='not in' then '排除'
			     else '' end
				 ), '&nbsp;') ,  (case when case when t.phrase_name is null then '' else t.phrase_name end ='' then (select col_name from t_import_field where tuid = t.field_id) else '' end)
				 ) ) 
		end as show_name,
	concat('c' , t.rule_id) as superior_id,
	cast(t.rule_id as varchar(4000)) as rule_id,
	case when is_node='0' then 'clause-node' else 'clause-item' end as operator,
	cast('2' as varchar(4000)) as show_order
from 
t_import_rule_filter t 
where
t.rule_id in (select tuid from t_import_rule where tab_id=${fld:tab_id})
and
t.parent_id is null

union

select
	concat('j' , t.tuid) as tuid,
	case when t.logic_type='and' then '同时满足条件的结果'
		when t.logic_type='or' then '任意满足其中一个条件的结果' 
		else '' end as show_name,
	concat('j',cast(t.parent_id as varchar(4000))) as superior_id,
	cast(t.rule_id as varchar(4000)) as rule_id,
	'clause-node' as operator,
	'4' as show_order
from 
t_import_rule_filter t
where
t.rule_id in (select tuid from t_import_rule where tab_id=${fld:tab_id})
and
t.parent_id is not null
and
t.is_node = '0'

union

select
	concat('j' , t.tuid) as tuid,
	
	concat(concat(concat(concat(
	(select max(field_name_cn) as field_name_cn from t_field a,t_import_table b where a.table_id = b.table_id and  a.field_code = t.clause_code  and b.tuid = ${fld:tab_id}) 
	, '&nbsp;') , 
	case when t.clause_filter='=' then '等于'
	     when t.clause_filter='like' then '包含'
	     when t.clause_filter='>' then '大于'
	     when t.clause_filter='>=' then '大于等于'
	     when t.clause_filter='<' then '小于'
	     when t.clause_filter='<=' then '小于等于'
	     when t.clause_filter='<>' then '不等于'
	     when t.clause_filter='is not null' then '非空'
	     when t.clause_filter='is null' then '为空'
	     when t.clause_filter='in' then '任意满足'
	     when t.clause_filter='not in' then '排除'
	     else '' end
	), '&nbsp;') , 
	(case when case when t.phrase_name is null then '' else t.phrase_name end = '' then (select col_name from t_import_field where tuid = t.field_id) else '' end)
	)
	 as show_name,
	concat('j',cast(t.parent_id as varchar(4000))) as superior_id,
	cast(t.rule_id as varchar(4000)) as rule_id,
	'clause-item' as operator,
	'5' as show_order
from 
t_import_rule_filter t
where
t.rule_id in (select tuid from t_import_rule where tab_id=${fld:tab_id}) 
and
t.parent_id is not null
and
t.is_node = '1'


order by 
	show_order,show_name
