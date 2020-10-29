<template>
  <div>
    <h3>Start Here...</h3>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import type {ICustomAttributeList} from '@/CustomAttributes';
import type {IFieldOverride, IFolderTypeFieldInfo} from '@/FieldSchema';

export default defineComponent({
    props:{
        value: {},
        fixedFields: Array,
    },
    setup(props:{value:{attr:ICustomAttributeList, field:IFieldOverride},fixedFields: IFolderTypeFieldInfo}) {
        return {
            fixedFields:props.fixedFields,
            fields: props.value.field,
            attrs: props.value.attr,
        };
    }
})
</script>