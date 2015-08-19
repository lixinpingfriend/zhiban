select
	(select tenantry_name from t_tenantry where tenantry_id = ${def:tenantry}) as tenantry_name
from
	dual