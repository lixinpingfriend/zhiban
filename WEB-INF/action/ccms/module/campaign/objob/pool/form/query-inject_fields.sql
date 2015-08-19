SELECT
     t.search_table_id
    , t.search_form_id
    , t.table_id	as root_table_id
    , ta.table_name as root_table_name
    , t.form_id		as root_form_id
    , f.form_name as root_form_name
	,t.bz_type
	,t.cust_name 
	,t.cust_code 
	,t.cust_sex 
	,t.data_owner 
	,t.cust_name_lable 
	,t.cust_code_lable 
	,t.cust_sex_lable 
	,t.data_owner_lable 
	,t.phone_number1 
	,t.phone_number2 
	,t.phone_number3 
	,t.phone_number4 
	,t.phone_number5 
	,t.phone_number6 
	,t.number_lable1 
	,t.number_lable2 
	,t.number_lable3 
	,t.number_lable4 
	,t.number_lable5 
	,t.number_lable6 
	,t.sms_number 
	,t.sms_number_lable 
	,t.email 
	,t.email_lable 
	,j.job_priority as priority
	,t.pk_value 
	,t.pk_value_lable 
	,t.bz_pk_value 
	,t.bz_pk_value_lable 
	,t.interested_series
	,t.interested_series_lable
	,t.import_data_batch
	,t.import_data_batch_lable
FROM
	cs_job_model t
	inner join cs_job j on j.model_id = t.tuid
	left join t_form f on t.form_id = f.tuid
	left join t_table ta on t.table_id = ta.tuid
WHERE
    j.tuid = ${fld:job_id}
