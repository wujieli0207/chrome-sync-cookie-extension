<template>
  <a-table :columns="columns" :data-source="dataSource" :pagination="false">
    <template #bodyCell="{ column, text, record }">
      <!-- 可编辑行 -->
      <template v-if="column.dataIndex === 'type'">
        <!-- TODO 增加其他类型同步 -->
        <span>{{ text }}</span>
      </template>
      <template v-if="['from', 'cookieName', 'to'].includes(column.dataIndex)">
        <div>
          <a-input
            v-if="editableData[record.id]"
            v-model:value="editableData[record.id][column.dataIndex]"
          />
          <span v-else>{{ text }}</span>
        </div>
      </template>

      <!-- 操作列 -->
      <template v-if="column.key === 'action'">
        <span v-if="editableData[record.id]">
          <a-button type="text" @click="handleSave(record.id)">保存</a-button>
          <a-popconfirm title="确认撤销？" @confirm="handleCancel(record.id)">
            <a>撤销</a>
          </a-popconfirm>
        </span>
        <span v-else>
          <a-button type="text" @click="handleEdit(record.id)">编辑</a-button>

          <a-popconfirm title="确认删除？" @confirm="handleDelete(record.id)">
            <a-button type="text" danger>删除</a-button>
          </a-popconfirm>
        </span>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { UnwrapRef } from "vue";
import { cloneDeep } from "lodash-es";
import { ICookieTableDataSource, ICookieTableColumn } from "./type";

const TYPE = ["cookie", "sessionStorage"];

const columns = ref<ICookieTableColumn[]>([
  {
    title: "id",
    dataIndex: "id",
    key: "id",
    align: "center",
  },
  {
    title: "类型",
    dataIndex: "type",
    key: "type",
    align: "center",
  },
  {
    title: "from",
    dataIndex: "from",
    key: "from",
    align: "center",
  },
  {
    title: "cookie name",
    dataIndex: "cookieName",
    key: "cookieName",
    align: "center",
  },
  {
    title: "to",
    dataIndex: "to",
    key: "to",
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    align: "center",
  },
]);

const dataSource = ref<ICookieTableDataSource[]>([
  {
    id: "1",
    type: "cookie",
    from: ".horizon.com",
    cookieName: "fesso_access_token",
    to: "localhost",
  },
  {
    id: "2",
    type: "cookie",
    from: ".horizon.com",
    cookieName: "fesso_refresh_token",
    to: "localhost",
  },
  {
    id: "3",
    type: "cookie",
    from: ".horizon.com",
    cookieName: "fesso_token_since",
    to: "localhost",
  },
  {
    id: "4",
    type: "cookie",
    from: ".horizon.com",
    cookieName: "original_access_token",
    to: "localhost",
  },
]);

const editableData: UnwrapRef<Record<string, ICookieTableDataSource>> =
  reactive({});

function handleEdit(rowId: string) {
  editableData[rowId] = cloneDeep(
    dataSource.value.filter((item) => item.id === rowId)[0]
  );
}

function handleSave(rowId: string) {
  Object.assign(
    dataSource.value.filter((item) => item.id === rowId)[0],
    editableData[rowId]
  );
  delete editableData[rowId];
}

function handleDelete(rowId: string) {
  const deleteIndex = dataSource.value.findIndex((item) => (item.id = rowId));
  dataSource.value.splice(deleteIndex, 1);
}

function handleCancel(rowId: string) {
  delete editableData[rowId];
}
</script>
