<template>
  <a-table :columns="columns" :data-source="dataSource" :pagination="false">
    <template #bodyCell="{ column, text, record }">
      <!-- 可编辑行 -->
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

  <a-row class="handle">
    <a-col :span="4">
      <a-button type="primary" @click="handleAdd">新增</a-button>
    </a-col>
    <a-col :span="8">
      是否开启同步：
      <a-switch
        v-model:checked="isOpenSync"
        checked-children="开"
        un-checked-children="关"
      ></a-switch>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, unref, watch } from "vue";
import type { UnwrapRef } from "vue";
import { cloneDeep, isEmpty } from "lodash-es";
import useStorage from "./hooks/useStorage";
import { ICookieTableDataSource, ICookieTableColumn, LIST_KEY } from "./type";

const isOpenSync = ref(true);

const columns = ref<ICookieTableColumn[]>([
  {
    title: "id",
    dataIndex: "id",
    key: "id",
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
    from: ".fehorizon.com",
    cookieName: "fesso_access_token",
    to: "localhost",
  },
  {
    id: "2",
    from: ".fehorizon.com",
    cookieName: "fesso_refresh_token",
    to: "localhost",
  },
  {
    id: "3",
    from: ".fehorizon.com",
    cookieName: "fesso_token_since",
    to: "localhost",
  },
  {
    id: "4",
    from: ".fehorizon.com",
    cookieName: "original_access_token",
    to: "localhost",
  },
]);

const editableData: UnwrapRef<Record<string, ICookieTableDataSource>> =
  reactive({});

const { updateStorage, getStorage, updateCookie } = useStorage();

onMounted(async () => {
  // 初始化开启同步状态
  const openSyncLocal = await chrome.storage.local.get("isOpenSync");

  if (!isEmpty(openSyncLocal)) {
    isOpenSync.value = openSyncLocal.isOpenSync;
  }
  console.log("isOpenSync.value: ", isOpenSync.value);

  // 从 localStorage 初始化数据
  const storage = await getStorage();
  const domainList = !isEmpty(storage)
    ? (Object.values(storage[LIST_KEY]) as ICookieTableDataSource[])
    : [];

  if (!isEmpty(domainList)) {
    dataSource.value = domainList;
  }

  // 更新 localStorage 和 cookie
  if (!isEmpty(unref(dataSource))) {
    updateStorage(dataSource.value);

    dataSource.value.forEach((item) => {
      updateCookie({
        from: item.from,
        to: item.to,
        cookieName: item.cookieName,
      });
    });
  }
});

watch(isOpenSync, async () => {
  await chrome.storage.local.set({ isOpenSync: isOpenSync.value });
});

function handleEdit(rowId: string) {
  editableData[rowId] = cloneDeep(
    dataSource.value.filter((item) => item.id === rowId)[0]
  );
}

async function handleSave(rowId: string) {
  Object.assign(
    dataSource.value.filter((item) => item.id === rowId)[0],
    editableData[rowId]
  );
  delete editableData[rowId];
  // 更新 localStorage
  updateStorage(dataSource.value);
}

function handleDelete(rowId: string) {
  const deleteIndex = dataSource.value.findIndex((item) => (item.id = rowId));
  dataSource.value.splice(deleteIndex - 1, 1);
}

function handleCancel(rowId: string) {
  delete editableData[rowId];
}

function handleAdd() {
  const maxId =
    dataSource.value.length > 0
      ? Math.max(...dataSource.value.map((item) => Number(item.id)))
      : 0;

  const addDataId = (maxId + 1).toString();

  dataSource.value.push({
    id: addDataId,
    from: "",
    cookieName: "",
    to: "",
  });

  // 新增后空数据可以编辑
  handleEdit(addDataId);
}
</script>

<style>
.handle {
  margin-top: 1rem;
}
</style>
