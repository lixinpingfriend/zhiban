INSERT	INTO
cs_job_model
(
	tuid
	, subject_id
	, search_table_id
	, search_form_id
	, model_name
	, is_enabled
	, import_data_batch
	, import_data_batch_lable
	, bz_type
	, search_sql
	, cust_name
	, cust_code
	, cust_sex
	, data_owner
	, cust_name_lable
	, cust_code_lable
	, cust_sex_lable
	, data_owner_lable
	, phone_number1
	, phone_number2
	, phone_number3
	, phone_number4
	, phone_number5
	, phone_number6
	, number_lable1
	, number_lable2
	, number_lable3
	, number_lable4
	, number_lable5
	, number_lable6
	, sms_number
	, sms_number_lable
	, email
	, email_lable
	, pk_value
	, pk_value_lable
	, bz_pk_value
	, bz_pk_value_lable
	, interested_series
	, interested_series_lable
	, created
	, createdby
	, updated
	, updatedby
)
VALUES
(
	${seq:nextval@seq_cs_job_model}
	,${fld:subject_id}
	,${fld:search_table_id}
	,${fld:search_form_id}
	,${fld:model_name}
	,'0'
	,${fld:import_data_batch}
	,${fld:import_data_batch_lable}
	,${fld:bz_type}
	,${fld:search_sql}
	, ${fld:cust_name}
	, ${fld:cust_code}
	, ${fld:cust_sex}
	, ${fld:data_owner}
	, ${fld:cust_name_lable}
	, ${fld:cust_code_lable}
	, ${fld:cust_sex_lable}
	, ${fld:data_owner_lable}
	, ${fld:phone_number1}
	, ${fld:phone_number2}
	, ${fld:phone_number3}
	, ${fld:phone_number4}
	, ${fld:phone_number5}
	, ${fld:phone_number6}
	, ${fld:number_lable1}
	, ${fld:number_lable2}
	, ${fld:number_lable3}
	, ${fld:number_lable4}
	, ${fld:number_lable5}
	, ${fld:number_lable6}
	, ${fld:sms_number}
	, ${fld:sms_number_lable}
	, ${fld:email}
	, ${fld:email_lable}
	, ${fld:pk_value}
	, ${fld:pk_value_lable}
	, ${fld:bz_pk_value}
	, ${fld:bz_pk_value_lable}	
	, ${fld:interested_series}
	, ${fld:interested_series_lable}
	, {ts '${def:timestamp}'}
	, '${def:user}'
	, {ts '${def:timestamp}'}
	, '${def:user}'
)