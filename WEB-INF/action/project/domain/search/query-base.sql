select tuid,domain_value,domain_name,name_space  from t_domain
where name_space=${fld:namespace}