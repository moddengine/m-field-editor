<template>
	<v-container fluid>
		<v-row>
			<v-col cols="12">
				<div class="text-h5 mb-4">Simple Product Data Fields</div>

				<div class="text-h6 mb-2">Built-In Fields</div>
				<v-simple-table class="mb-3">
					<template v-slot:default>
						<thead>
							<tr>
								<th class="text-left" style="width: 25%">Name</th>
								<th class="text-left" style="width: 30%">Label</th>
								<th class="text-left" style="width: 20%">Type</th>
								<th class="text-left" style="width: 25%"></th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="(item, index) in getFields('built-in')"
								:key="index"
							>
								<td>{{ item.name }}</td>
								<td>{{ item.label }}</td>
								<td>{{ item.type }}</td>
								<td>
									<v-btn class="mr-2" color="success" @click="showFormDialog(index, 'built-in')" style="width: 70px">Edit</v-btn>
									<v-btn v-if="isModified(index)" color="warning" @click="resetField(index)" style="width: 70px">Reset</v-btn>
								</td>
							</tr>
						</tbody>
					</template>
				</v-simple-table>

				<div class="d-flex justify-space-between mb-2">
					<div class="text-h6">Custom Fields</div>
					<v-btn color="primary" @click="showFormDialog()">
						<v-icon left>mdi-plus</v-icon> Add
					</v-btn>
				</div>
				<v-simple-table class="mb-3">
					<template v-slot:default>
						<thead>
							<tr>
								<th class="text-left" style="width: 25%">Name</th>
								<th class="text-left" style="width: 30%">Label</th>
								<th class="text-left" style="width: 20%">Type</th>
								<th class="text-left" style="width: 25%"></th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="(item, index) in getFields('custom')"
								:key="index"
							>
								<td>{{ item.name }}</td>
								<td>{{ item.label }}</td>
								<td>{{ item.type }}</td>
								<td>
									<v-btn color="success" class="mr-2" @click="showFormDialog(index, 'custom')" style="width: 70px">Edit</v-btn>
									<v-btn color="error" @click="resetField(index)" style="width: 70px">Delete</v-btn>
								</td>
							</tr>
						</tbody>
					</template>
				</v-simple-table>
			</v-col>
		</v-row>
		<form-dialog 
			:show="state.showFormDialog" 
			:data="state.formData"
			@close="onFormDialogClose"
			@save="onFormDialogSave"
		></form-dialog>
	</v-container>
</template>
<script lang="ts">
import { defineComponent, reactive, SetupContext } from '@vue/composition-api';
import type { ICustomAttributeList } from '@/CustomAttributes';
import type { IFieldOverride, IFolderTypeFieldInfo } from '@/FieldSchema';
import FormDialog from './FormDialog.vue';

interface State {
	showFormDialog: boolean
	selectedFieldIndex: null | number
	formData: CustomFields
	customFields: CustomFields[]
}

interface Props {
	value: {
		attr:ICustomAttributeList
		field:IFolderTypeFieldInfo[]
	}
	fixedFields: IFolderTypeFieldInfo
}

interface CustomFields extends IFolderTypeFieldInfo {
	uid: null | number
}

export default defineComponent({
	components: {
		FormDialog
	},
    props:{
        value: {},
        fixedFields: Array,
	},
    setup(props: Props, context: SetupContext) {
		const state = reactive<State>({
			showFormDialog: false,
			selectedFieldIndex: null,
			formData: {
				name: 	"",
				label: 	"",
				hint: 	"",
				type: 	"",
				group: 	"",
				rules: 	[],
				uid: null,
			},
			customFields: []
		});

		function showFormDialog(item: number | null = null, category: string) {
			if (item !== null) {
				if (category === 'built-in') {
					let formData = props.value.field[item];

					const index = state.customFields.findIndex(fProps => fProps.uid === item);
					if (index > -1) {
						formData = state.customFields[index];
						state.selectedFieldIndex = index;
					}

					state.formData = { ...formData, uid: item };
				} else {
					state.selectedFieldIndex = item;
					state.formData = state.customFields[item];
				}
			}

			state.showFormDialog = true;
		}

		function getFields(category: string) {
			if (category === 'built-in') {
				return props.value.field.map((item, index) => {
					const field = state.customFields.find(fProps => fProps.uid === index);

					if (typeof field !== "undefined") {
						return field;
					}

					return item;
				})
			} else {
				return state.customFields.filter(fProps => fProps.uid === null);
			}
		}

		function onFormDialogClose() {
			state.formData = {
				name: 	"",
				label: 	"",
				hint: 	"",
				type: 	"",
				group: 	"",
				rules: 	[],
				uid: null,
			};
			state.selectedFieldIndex = null;
			state.showFormDialog = false;
		}

		function onFormDialogSave(data: CustomFields) {
			if (state.selectedFieldIndex !== null) {
				context.root.$set(state.customFields, state.selectedFieldIndex, data);
			} else {
				state.customFields.push(data);
			}
			
			state.formData = {
				name: 	"",
				label: 	"",
				hint: 	"",
				type: 	"",
				group: 	"",
				rules: 	[],
				uid: null,
			};
			state.selectedFieldIndex = null;
			state.showFormDialog = false;
		}

		function isModified(item: number) {
			return ~state.customFields.findIndex(fProps => fProps.uid === item);
		}

		function resetField(item: number) {
			const index = state.customFields.findIndex(fProps => fProps.uid === item);

			state.customFields.splice(index, 1);
		}

        return {
			state,

            // fixedFields:props.fixedFields,
            fields: props.value.field,
			attrs: props.value.attr,

			getFields,
			showFormDialog,
			onFormDialogClose,
			onFormDialogSave,
			isModified,
			resetField,
        };
    }
})
</script>
